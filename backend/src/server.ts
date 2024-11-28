import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { IUser } from "./dataTypes/interfaces";
import { EnumCount, EnumNotificationUser, EnumStatus } from "./dataTypes/enums";
import { UsersList } from "./models/usersModel";
import { User } from "./dataTypes/types";
import database from "./config/database";
import socket from "./config/socket";
import { Notification, UsersObserver } from "./observers/notificationObserver";
import { calculateCount } from "./helpers/countHelper";
import { addObserversWhoCanCheckInNow, addObserversWhoStillInWaiting } from "./helpers/observerHelper";

dotenv.config();

export const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());

database();
const io = socket();


// ============================ template method design pattern =====================================

abstract class NotificationProcessor {
  public process(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    this.attach(users, notification, remainingSeatsCount);
    this.notify(notification);
    this.detachAll(notification);
  }

  protected abstract attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void;
  protected abstract notify(notification: Notification): void;
  protected abstract detachAll(notification: Notification): void;
}

class SelfNotificationProcessor extends NotificationProcessor {
  protected attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    const observer = new UsersObserver(users[0]);
    notification.attach(observer);
  }

  protected notify(notification: Notification): void {
    notification.notify({ status: EnumStatus.ServiceCompleted });
  }

  protected detachAll(notification: Notification): void {
    notification.detachAll();
  }
}

class CheckInNowNotificationProcessor extends NotificationProcessor {
  protected attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    addObserversWhoCanCheckInNow(users, notification, remainingSeatsCount);
  }

  protected notify(notification: Notification): void {
    notification.notify(undefined, updateCanCheckIn);
    notification.notify({ canCheckIn: true });
  }

  protected detachAll(notification: Notification): void {
    notification.detachAll();
  }
}

class StillInWaitingNotificationProcessor extends NotificationProcessor {
  protected attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    addObserversWhoStillInWaiting(users, notification);
  }

  protected notify(notification: Notification): void {
    notification.notify(undefined, sendUpdatedWaitingPosition);
  }

  protected detachAll(notification: Notification): void {
    notification.detachAll();
  }
}

// ============================ notification helpers =====================================
export const sendNotification = (name: string, data: Partial<IUser>) => {
  io.to(name ?? "").emit("notification", data);
};

const updateCanCheckIn = async (user: IUser) => {
  user.canCheckIn = true;
  await user.save();
};

const sendUpdatedWaitingPosition = async (user: IUser, index?: number) => {
  const name = user.name;
  sendNotification(name ?? "", { waitingPosition: (index ?? 0) + 1 });
};

const notificationService = (userType: EnumNotificationUser, users: IUser[], notification: Notification, remainingSeatsCount?: number) => {
  switch (userType) {
    case EnumNotificationUser.Self:
      const selfNotificationProcessor = new SelfNotificationProcessor();
      selfNotificationProcessor.process(users, notification, remainingSeatsCount);
      break;
    case EnumNotificationUser.CanCheckInNow:
      const checkInNowNotificationProcessor = new CheckInNowNotificationProcessor();
      checkInNowNotificationProcessor.process(users, notification, remainingSeatsCount);
      break;
    case EnumNotificationUser.StillInWaiting:
      const stillInWaitingNotificationProcessor = new StillInWaitingNotificationProcessor();
      stillInWaitingNotificationProcessor.process(users, notification, remainingSeatsCount);
      break;
    default:
      break;
  }
};

// ============================ schedule service =====================================

const runServiceSchedule = (name: string, partySize: number) => {
  const totalSeatsCount = 10;
  const serviceTimePerPersonInMilliSec = 3000;
  setTimeout(async () => {
    const user = await UsersList.findOne({ name: name });
    if (user) {
      user.status = EnumStatus.ServiceCompleted;
      await user.save();
      const allUsers = await UsersList.find();
      const currentBookedSeatsCount = calculateCount(allUsers, EnumCount.BookedSeats);
      const currentCanCheckInSeatsCount = calculateCount(allUsers, EnumCount.CanCheckInSeats);
      let remainingSeatsCount = totalSeatsCount - (currentBookedSeatsCount + currentCanCheckInSeatsCount);
      const usersInWaiting = await UsersList.find({ status: EnumStatus.InWaitingList, canCheckIn: false });
      const notification = new Notification();
      notificationService(EnumNotificationUser.Self, [user], notification);
      notificationService(EnumNotificationUser.CanCheckInNow, usersInWaiting, notification, remainingSeatsCount);
      notificationService(EnumNotificationUser.StillInWaiting, usersInWaiting, notification);
    }
  }, serviceTimePerPersonInMilliSec * partySize);
};

// ============================ API =====================================

app.post("/api/join", async (req: Request, res: Response) => {
  const totalSeatsCount = 10;
  const { name, partySize }: { name: string; partySize: number } = req.body;

  const allUserInfo = await UsersList.find();

  const bookedSeatsCount = calculateCount(allUserInfo, EnumCount.BookedSeats);
  const canCheckInSeatsCount = calculateCount(allUserInfo, EnumCount.CanCheckInSeats);
  const usersInWaitingListCount = calculateCount(allUserInfo, EnumCount.UsersInWaiting);

  const availableSeatsCount = totalSeatsCount - (bookedSeatsCount + canCheckInSeatsCount);
  const isSeatAvailable = partySize <= availableSeatsCount;
  const isNoUserInWaiting = usersInWaitingListCount === 0;
  let newUser: User = {
    name: name,
    partySize: partySize,
  };
  const canSeatIn = isSeatAvailable && isNoUserInWaiting;
  if (canSeatIn) {
    newUser = { ...newUser, status: EnumStatus.SeatIn };
    const newUserEntry = new UsersList({ ...newUser });
    await newUserEntry.save();
    res.status(201).json({ message: "New user has been added", user: newUser });
    runServiceSchedule(name, partySize);
  } else {
    const waitingListLastPosition = (await UsersList.find({ status: EnumStatus.InWaitingList, canCheckIn: false })).length;
    newUser = { ...newUser, status: EnumStatus.InWaitingList, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 };
    const { waitingPosition, ...userWithoutPosition } = newUser;
    const newUserEntry = new UsersList({ ...userWithoutPosition });
    await newUserEntry.save();
    res.status(201).json({ message: "New user has been added", user: newUser });
  }
});

app.post("/api/checkin", async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = await UsersList.findOne({ name: name });
  if (user) {
    user.status = EnumStatus.SeatIn;
    await user.save();
    res.status(200).send({ message: "User has checked in", user: user });
    runServiceSchedule(name, user.partySize ?? 0);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.get("/api/user/:name", async (req: Request<{ name: string }>, res: Response): Promise<any> => {
  const { name } = req.params;

  try {
    const allUsersInfo = await UsersList.find();
    let user: User = {};
    let waitingPosition = 0;

    for (let index = 0; index < allUsersInfo.length; index++) {
      if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
        waitingPosition = waitingPosition + 1;
      }
      if (allUsersInfo[index].name === name) {
        user = allUsersInfo[index].toObject() as User;
        if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
          user = { ...user, waitingPosition: waitingPosition };
        }
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});

app.delete("/api/deleteUser", async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = await UsersList.deleteOne({ name: name });
  if (user) {
    res.status(200).send({ message: "User has been deleted" });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
