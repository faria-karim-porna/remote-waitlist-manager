"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
// MongoDB connection setup
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));
// Define the waitlist schema
const waitlistSchema = new mongoose_1.default.Schema({
    name: String,
    partySize: Number,
    checkedIn: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
});
const Waitlist = mongoose_1.default.model("Waitlist", waitlistSchema);
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
app.post("/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("body", req.body);
    const { name, partySize } = req.body;
    const newEntry = new Waitlist({ name, partySize });
    yield newEntry.save();
    res.status(201).send("Joined the waitlist");
}));
app.post("/checkin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const party = yield Waitlist.findById(id);
    if (party) {
        party.checkedIn = true;
        yield party.save();
        res.status(200).send("Checked in");
    }
    else {
        res.status(404).send("Party not found");
    }
}));
// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
