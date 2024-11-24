import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
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

  // // Handle notifications to a specific room
  // socket.on("notify", (data: NotificationData) => {
  //   const { name, message } = data;
  //   console.log(`Sending message to ${name}: ${message}`);
  //   setTimeout(() => {
  //     io.to("Faria KP").emit("notification", message);
  //   }, 5000);
  // });

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
const usersListSchema = new mongoose.Schema({
  name: String,
  partySize: Number,
  status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
  joinedAt: { type: Date, default: Date.now },
  canCheckIn: { type: Boolean, default: false },
});

const UsersList = mongoose.model("UsersList", usersListSchema);

// const seatsCountSchema = new mongoose.Schema({
//   bookedSeats: { type: Number, default: 0 },
//   inWaitingSeats: { type: Number, default: 0 },
// });

// const SeatsCount = mongoose.model("SeatsCount", seatsCountSchema);

const runServiceSchedule = (name: string, partySize: number) => {
  const totalSeatsCount = 10;
  const serviceTimePerPersonInMilliSec = 3000;
  setTimeout(async () => {
    const user = await UsersList.findOne({ name: name });
    if (user) {
      user.status = EnumStatus.ServiceCompleted;
      await user.save();
      io.to(name).emit("notification", { status: EnumStatus.ServiceCompleted });
      const allUsers = await UsersList.find();
      let currentBookedSeatsCount = 0;
      let currentCanCheckInSeatsCount = 0;
      let userWaitingPosition = 0;
      for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === EnumStatus.SeatIn) {
          currentBookedSeatsCount = currentBookedSeatsCount + (allUsers[index]?.partySize ?? 0);
        }
        if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === true) {
          currentCanCheckInSeatsCount = currentCanCheckInSeatsCount + (allUsers[index]?.partySize ?? 0);
        }
      }
      let remainingSeatsCount = totalSeatsCount - (currentBookedSeatsCount + currentCanCheckInSeatsCount);

      for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
          remainingSeatsCount = remainingSeatsCount - (allUsers[index].partySize ?? 0);
          if (remainingSeatsCount >= 0) {
            allUsers[index].canCheckIn = true;
            await allUsers[index].save();
            io.to(allUsers[index].name ?? "").emit("notification", { canCheckIn: true });
          } else {
            break;
          }
        }
      }
      for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
          userWaitingPosition = userWaitingPosition + 1;
          if (allUsers[index] && allUsers[index].name) {
            io.to(allUsers[index].name ?? "").emit("notification", { waitingPosition: userWaitingPosition });
          }
        }
      }
    }
  }, serviceTimePerPersonInMilliSec * partySize);
};

app.post("/api/join", async (req: Request, res: Response) => {
  const totalSeatsCount = 10;
  const { name, partySize }: { name: string; partySize: number } = req.body;
  let bookedSeatsCount = 0;
  let canCheckInSeatsCount = 0;
  let usersInWaitingListCount = 0;
  const allUserInfo = await UsersList.find();

  for (let index = 0; index < allUserInfo.length; index++) {
    if (allUserInfo[index].status === EnumStatus.SeatIn) {
      bookedSeatsCount = bookedSeatsCount + (allUserInfo[index]?.partySize ?? 0);
    }
    if (allUserInfo[index].status === EnumStatus.InWaitingList && allUserInfo[index].canCheckIn === true) {
      canCheckInSeatsCount = canCheckInSeatsCount + (allUserInfo[index]?.partySize ?? 0);
    }
    if (allUserInfo[index].status === EnumStatus.InWaitingList && allUserInfo[index].canCheckIn === false) {
      usersInWaitingListCount = usersInWaitingListCount + 1;
    }
  }

  const availableSeatsCount = totalSeatsCount - (bookedSeatsCount + canCheckInSeatsCount);
  const isSeatAvailable = partySize <= availableSeatsCount;
  const isNoUserInWaiting = usersInWaitingListCount === 0;
  let newUser: User = {
    name: name,
    partySize: partySize,
  };
  if (isSeatAvailable && isNoUserInWaiting) {
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

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
