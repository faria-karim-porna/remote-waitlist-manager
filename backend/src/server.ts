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
  status: EnumStatus;
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
app.post("/join", async (req: Request, res: Response) => {
  const { name, partySize }: { name: string; partySize: number } = req.body;

  let newUser: User = {
    name: name,
    partySize: partySize,
    status: EnumStatus.InWaitingList,
  };

  const fillUpSeats = (await Waitlist.find({ status: EnumStatus.SeatIn })).length ?? 0;
  const availableSeats = totalSeats - fillUpSeats;
  const isNoPeopleInWaiting = !((await Waitlist.find({ status: EnumStatus.InWaitingList, canCheckIn: false })).length ?? 0);
  if (isNoPeopleInWaiting) {
    if ((partySize ?? 0) <= availableSeats) {
      newUser = { ...newUser, canCheckIn: true };
    } else {
      newUser = { ...newUser, canCheckIn: false, waitingPosition: 1 };
    }
  } else {
    const waitingListLastPosition = (await Waitlist.find({ status: EnumStatus.InWaitingList, canCheckIn: false })).length;
    newUser = { ...newUser, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 };
  }
  const { waitingPosition, ...userWithoutPosition } = newUser;
  const newEntry = new Waitlist({ ...userWithoutPosition });
  await newEntry.save();
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
    const user = await Waitlist.findOne({ name });

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
