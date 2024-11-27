import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import mongoose, { Document } from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

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

interface NotificationData {
  name: string;
  message: string;
}

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

enum EnumStatus {
  None = "None",
  SeatIn = "Seat In",
  InWaitingList = "In Waiting List",
  ServiceCompleted = "Service Completed",
}

type User = {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  joinedAt?: Date;
  canCheckIn?: boolean;
  waitingPosition?: number;
};

interface IUser extends Document {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  joinedAt?: Date;
  canCheckIn?: boolean;
  waitingPosition?: number;
}

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

enum EnumNotificationUser {
  Self = "Self",
  CanCheckInNow = "Can Check In Now",
  StillInWaiting = "Still In Waiting",
}

const getUsersWhoCanCheckInNow = (users: IUser[], remainingSeatsCount?: number) => {
  const usersCanCheckInNow: IUser[] = [];
  for (let index = 0; index < users.length; index++) {
    remainingSeatsCount = (remainingSeatsCount ?? 0) - (users[index].partySize ?? 0);
    if (remainingSeatsCount >= 0) {
      users[index].canCheckIn = true;
      usersCanCheckInNow.push(users[index]);
    } else {
      break;
    }
  }
  return usersCanCheckInNow;
};

const getUsersWhoStillInWaiting = (users: IUser[]) => {
  const usersStillInWaiting: IUser[] = [];
  for (let index = 0; index < users.length; index++) {
    if (users[index].status === EnumStatus.InWaitingList && users[index].canCheckIn === false) {
      usersStillInWaiting.push(users[index]);
    }
  }

  return usersStillInWaiting;
};

const sendNotification = (name: string, data: Partial<IUser>) => {
  io.to(name ?? "").emit("notification", data);
};

const addWaitingPositionData = (users: IUser[]) => {
  for (let index = 0; index < users.length; index++) {
    users[index].waitingPosition = index + 1;
  }

  return users;
};

const notificationService = (userType: EnumNotificationUser, allUsers: IUser[], name?: string, remainingSeatsCount?: number) => {
  switch (userType) {
    case EnumNotificationUser.Self:
      sendNotification(name ?? "", { status: EnumStatus.ServiceCompleted });
      break;
    case EnumNotificationUser.CanCheckInNow:
      for (let index = 0; index < allUsers.length; index++) {
        const name = allUsers[index].name;
        sendNotification(name ?? "", { canCheckIn: true });
      }
      break;
    case EnumNotificationUser.StillInWaiting:
      for (let index = 0; index < allUsers.length; index++) {
        const name = allUsers[index].name;
        sendNotification(name ?? "", { waitingPosition: index + 1 });
      }
      break;
    default:
      break;
  }
};

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

enum EnumCount {
  BookedSeats = "Booked Seats",
  CanCheckInSeats = "Can Check In Seats",
  UsersInWaiting = "Users In Waiting",
}

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
      const usersCanCheckInNow = getUsersWhoCanCheckInNow(usersInWaiting, remainingSeatsCount);
      const usersStillInWaiting = getUsersWhoStillInWaiting(usersInWaiting);
      for (let index = 0; index < usersCanCheckInNow.length; index++) {
        await usersCanCheckInNow[index].save();
      }
      notificationService(EnumNotificationUser.Self, usersInWaiting, name, remainingSeatsCount);
      notificationService(EnumNotificationUser.CanCheckInNow, usersCanCheckInNow, name, remainingSeatsCount);
      notificationService(EnumNotificationUser.StillInWaiting, usersStillInWaiting, name, remainingSeatsCount);
    }
  }, serviceTimePerPersonInMilliSec * partySize);
};

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
  const canSeatIn = isSeatAvailable && isNoUserInWaiting;
  let newUser: User = {
    name: name,
    partySize: partySize,
  };
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
