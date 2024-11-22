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

// Define the waitlist schema
const waitlistSchema = new mongoose.Schema({
  name: String,
  partySize: Number,
  checkedIn: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
});
const Waitlist = mongoose.model("Waitlist", waitlistSchema);

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send the current queue status every 5 seconds
  const interval = setInterval(() => {
    Waitlist.find({ checkedIn: false }).then((queue) => {
      socket.emit("queueStatus", queue);
    });
  }, 5000);

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(interval);
  });
});

// API Routes
app.post("/join", async (req: Request, res: Response) => {
  console.log("body", req.body);
  const { name, partySize }: { name: string; partySize: number } = req.body;
  const newEntry = new Waitlist({ name, partySize });
  await newEntry.save();
  res.status(201).send("Joined the waitlist");
});

app.post("/checkin", async (req: Request, res: Response) => {
  const { id } = req.body;
  const party = await Waitlist.findById(id);
  if (party) {
    party.checkedIn = true;
    await party.save();
    res.status(200).send("Checked in");
  } else {
    res.status(404).send("Party not found");
  }
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
