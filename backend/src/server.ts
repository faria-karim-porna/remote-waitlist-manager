import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

const mongoUri: string | undefined = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

// MongoDB connection setup
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

enum EnumStatus {
  None = "None",
  SeatIn = "Seat In",
  InWaitingList = "In Waiting List",
  ServiceCompleted = "Service Completed",
}

// Define the waitlist schema

type User = {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  joinedAt?: Date;
  canCheckIn?: boolean;
  waitingPosition?: number;
};
const waitlistSchema = new mongoose.Schema({
  name: String,
  partySize: Number,
  status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
  joinedAt: { type: Date, default: Date.now },
  canCheckIn: { type: Boolean, default: false },
});
const Waitlist = mongoose.model("Waitlist", waitlistSchema);

let totalSeats = 10;

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Check seat availability
  socket.on("check-seats", async (name: string) => {
    console.log(`Checking seats for name: ${name}`);
    const fillUpSeats = (await Waitlist.find({ status: EnumStatus.SeatIn })).length ?? 0;
    const availableSeats = totalSeats - fillUpSeats;
    const firstWaitingPartyInfo = (await Waitlist.find({ status: EnumStatus.InWaitingList }))[0];
    if (name === (firstWaitingPartyInfo?.name ?? "")) {
      if ((firstWaitingPartyInfo.partySize ?? 0) <= availableSeats) {
        socket.emit("seats-available", {
          message: "Seats available",
          seatsLeft: availableSeats,
        });
      }
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // clearInterval(interval);
  });
});

// API Routes
app.post("/api/join", async (req: Request, res: Response) => {
  const totalSeatsCount = 10;
  const { name, partySize }: { name: string; partySize: number } = req.body;
  let bookedSeatsCount = 0;
  let canCheckInSeatsCount = 0;
  let usersInWaitingListCount = 0;
  const allUserInfo = await Waitlist.find();

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
    //   run a schedule
    //   after setTimeout remove the user from the seated database
    //  and send notification to the waited list party about check in
    //  and send notification to the other waited list party about changed waiting list
    //  and send notification to the person about thank you for coming
  } else {
    const waitingListLastPosition = (await Waitlist.find({ status: EnumStatus.InWaitingList, canCheckIn: false })).length;
    newUser = { ...newUser, status: EnumStatus.InWaitingList, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 };
  }
  const { waitingPosition, ...userWithoutPosition } = newUser;
  const newUserEntry = new Waitlist({ ...userWithoutPosition });
  await newUserEntry.save();
  res.status(201).json({ message: "Item has been added", user: newUser });
});

app.post("/checkin", async (req: Request, res: Response) => {
  const { id } = req.body;
  const party = await Waitlist.findById(id);
  if (party) {
    // party.checkedIn = true;
    await party.save();
    res.status(200).send("Checked in");
  } else {
    res.status(404).send("Party not found");
  }
});

app.get("/api/user/:name", async (req: Request<{ name: string }>, res: Response): Promise<any> => {
  const { name } = req.params;

  try {
    const allUsersInfo = await Waitlist.find();
    let user: User = {};
    let waitingPosition = 0;

    for (let index = 0; index < allUsersInfo.length; index++) {
      if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
        waitingPosition = waitingPosition + 1;
      }
      if (allUsersInfo[index].name === name) {
        user = allUsersInfo[index].toObject() as User;
        console.log(user);
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

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
