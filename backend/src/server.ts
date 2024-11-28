import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import mongoose, { Document } from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

// ============================ mongodb nodejs connection =====================================

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const mongoUri: string | undefined = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ============================ Socket.io nodejs connection =====================================

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (name: string) => {
    console.log(`${socket.id} joined ${name}`);
    socket.join(name);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ============================ enums =====================================

enum EnumStatus {
  None = "None",
  SeatIn = "Seat In",
  InWaitingList = "In Waiting List",
  ServiceCompleted = "Service Completed",
}

enum EnumNotificationUser {
  Self = "Self",
  CanCheckInNow = "Can Check In Now",
  StillInWaiting = "Still In Waiting",
}

enum EnumCount {
  BookedSeats = "Booked Seats",
  CanCheckInSeats = "Can Check In Seats",
  UsersInWaiting = "Users In Waiting",
}

// ============================ types =====================================

type User = {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  joinedAt?: Date;
  canCheckIn?: boolean;
  waitingPosition?: number;
};

// ============================ interfaces =====================================
interface IUser extends Document {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  joinedAt?: Date;
  canCheckIn?: boolean;
  waitingPosition?: number;
}

// ============================ models =====================================

const usersListSchema = new mongoose.Schema({
  name: String,
  partySize: Number,
  status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
  joinedAt: { type: Date, default: Date.now },
  canCheckIn: { type: Boolean, default: false },
});

const UsersList = mongoose.model<IUser>("UsersList", usersListSchema);

// const seatsCountSchema = new mongoose.Schema({
//   bookedSeats: { type: Number, default: 0 },
//   inWaitingSeats: { type: Number, default: 0 },
//   usersInWaitingList: { type: Number, default: 0 },
// });

// const SeatsCount = mongoose.model("SeatsCount", seatsCountSchema);

// ============================ observer design pattern =====================================

interface Observer<T> {
  get getObserver(): IUser;
  update(data?: Partial<T>, func?: () => void): void;
}

interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  detachAll(): void;
  notify(data?: T, func?: (param: T, index?: number) => void): void;
}

class Notification implements Subject<Partial<IUser>> {
  private observers: Observer<IUser>[] = [];

  attach(observer: Observer<IUser>): void {
    this.observers.push(observer);
  }

  detach(observer: Observer<IUser>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  detachAll(): void {
    this.observers = [];
  }

  notify(data?: Partial<IUser>, func?: (param: IUser, index?: number) => void): void {
    if (data) {
      this.observers.forEach((observer) => observer.update(data));
    } else if (func) {
      this.observers.forEach((observer, index) => {
        observer.update(undefined, () => func?.(observer?.getObserver, index));
      });
    }
  }
}

class UsersObserver implements Observer<IUser> {
  private user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  get getObserver() {
    return this.user;
  }

  update(data?: Partial<IUser>, func?: () => void): void {
    if (data) {
      sendNotification(this.user.name ?? "", data);
    } else {
      func?.();
    }
  }
}

const addObserversWhoCanCheckInNow = (users: IUser[], notification: Notification, remainingSeatsCount?: number) => {
  for (let index = 0; index < users.length; index++) {
    remainingSeatsCount = (remainingSeatsCount ?? 0) - (users[index].partySize ?? 0);
    if (remainingSeatsCount >= 0) {
      const observer = new UsersObserver(users[index]);
      notification.attach(observer);
    } else {
      break;
    }
  }
};

const addObserversWhoStillInWaiting = (users: IUser[], notification: Notification) => {
  const usersStillInWaiting: IUser[] = [];
  for (let index = 0; index < users.length; index++) {
    if (users[index].status === EnumStatus.InWaitingList && users[index].canCheckIn === false) {
      const observer = new UsersObserver(users[index]);
      notification.attach(observer);
    }
  }

  return usersStillInWaiting;
};

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

const sendNotification = (name: string, data: Partial<IUser>) => {
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

// ============================ count helpers =====================================

const calculateBookedSeatsCount = (allUsers: IUser[]) => {
  let currentBookedSeatsCount = 0;
  for (let index = 0; index < allUsers.length; index++) {
    if (allUsers[index].status === EnumStatus.SeatIn) {
      currentBookedSeatsCount = currentBookedSeatsCount + (allUsers[index]?.partySize ?? 0);
    }
  }
  return currentBookedSeatsCount;
};

const calculateCanCheckInSeatsCount = (allUsers: IUser[]) => {
  let currentCanCheckInSeatsCount = 0;
  for (let index = 0; index < allUsers.length; index++) {
    if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === true) {
      currentCanCheckInSeatsCount = currentCanCheckInSeatsCount + (allUsers[index]?.partySize ?? 0);
    }
  }
  return currentCanCheckInSeatsCount;
};

const calculateUsersInWaitingListCount = (allUsers: IUser[]) => {
  let usersInWaitingListCount = 0;
  for (let index = 0; index < allUsers.length; index++) {
    if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
      usersInWaitingListCount = usersInWaitingListCount + 1;
    }
  }
  return usersInWaitingListCount;
};

const calculateCount = (users: IUser[], type: EnumCount) => {
  let usersOrSeatsCount = 0;
  switch (type) {
    case EnumCount.BookedSeats:
      usersOrSeatsCount = calculateBookedSeatsCount(users);
      break;
    case EnumCount.CanCheckInSeats:
      usersOrSeatsCount = calculateCanCheckInSeatsCount(users);
      break;
    case EnumCount.UsersInWaiting:
      usersOrSeatsCount = calculateUsersInWaitingListCount(users);
      break;
    default:
      break;
  }
  return usersOrSeatsCount;
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
