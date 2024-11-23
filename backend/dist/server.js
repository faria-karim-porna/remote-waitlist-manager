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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var EnumStatus;
(function (EnumStatus) {
    EnumStatus["None"] = "None";
    EnumStatus["SeatIn"] = "Seat In";
    EnumStatus["InWaitingList"] = "In Waiting List";
    EnumStatus["ServiceCompleted"] = "Service Completed";
})(EnumStatus || (EnumStatus = {}));
const waitlistSchema = new mongoose_1.default.Schema({
    name: String,
    partySize: Number,
    status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
    joinedAt: { type: Date, default: Date.now },
    canCheckIn: { type: Boolean, default: false },
});
const Waitlist = mongoose_1.default.model("Waitlist", waitlistSchema);
let totalSeats = 10;
// WebSocket connection handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Check seat availability
    socket.on("check-seats", (name) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        console.log(`Checking seats for name: ${name}`);
        const fillUpSeats = (_a = (yield Waitlist.find({ status: EnumStatus.SeatIn })).length) !== null && _a !== void 0 ? _a : 0;
        const availableSeats = totalSeats - fillUpSeats;
        const firstWaitingPartyInfo = (yield Waitlist.find({ status: EnumStatus.InWaitingList }))[0];
        if (name === ((_b = firstWaitingPartyInfo === null || firstWaitingPartyInfo === void 0 ? void 0 : firstWaitingPartyInfo.name) !== null && _b !== void 0 ? _b : "")) {
            if (((_c = firstWaitingPartyInfo.partySize) !== null && _c !== void 0 ? _c : 0) <= availableSeats) {
                socket.emit("seats-available", {
                    message: "Seats available",
                    seatsLeft: availableSeats,
                });
            }
        }
    }));
    // Cleanup on disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // clearInterval(interval);
    });
});
// API Routes
app.post("/api/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const totalSeatsCount = 10;
    const { name, partySize } = req.body;
    let bookedSeatsCount = 0;
    let canCheckInSeatsCount = 0;
    let usersInWaitingListCount = 0;
    const allUserInfo = yield Waitlist.find();
    for (let index = 0; index < allUserInfo.length; index++) {
        if (allUserInfo[index].status === EnumStatus.SeatIn) {
            bookedSeatsCount = bookedSeatsCount + ((_b = (_a = allUserInfo[index]) === null || _a === void 0 ? void 0 : _a.partySize) !== null && _b !== void 0 ? _b : 0);
        }
        if (allUserInfo[index].status === EnumStatus.InWaitingList && allUserInfo[index].canCheckIn === true) {
            canCheckInSeatsCount = canCheckInSeatsCount + ((_d = (_c = allUserInfo[index]) === null || _c === void 0 ? void 0 : _c.partySize) !== null && _d !== void 0 ? _d : 0);
        }
        if (allUserInfo[index].status === EnumStatus.InWaitingList && allUserInfo[index].canCheckIn === false) {
            usersInWaitingListCount = usersInWaitingListCount + 1;
        }
    }
    const availableSeatsCount = totalSeatsCount - (bookedSeatsCount + canCheckInSeatsCount);
    const isSeatAvailable = partySize <= availableSeatsCount;
    const isNoUserInWaiting = usersInWaitingListCount === 0;
    let newUser = {
        name: name,
        partySize: partySize,
    };
    if (isSeatAvailable && isNoUserInWaiting) {
        newUser = Object.assign(Object.assign({}, newUser), { status: EnumStatus.SeatIn });
        //   run a schedule
        //   after setTimeout remove the user from the seated database
        //  and send notification to the waited list party about check in
        //  and send notification to the other waited list party about changed waiting list
        //  and send notification to the person about thank you for coming
    }
    else {
        const waitingListLastPosition = (yield Waitlist.find({ status: EnumStatus.InWaitingList, canCheckIn: false })).length;
        newUser = Object.assign(Object.assign({}, newUser), { status: EnumStatus.InWaitingList, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 });
    }
    const { waitingPosition } = newUser, userWithoutPosition = __rest(newUser, ["waitingPosition"]);
    const newUserEntry = new Waitlist(Object.assign({}, userWithoutPosition));
    yield newUserEntry.save();
    res.status(201).json({ message: "Item has been added", user: newUser });
}));
app.post("/checkin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const party = yield Waitlist.findById(id);
    if (party) {
        // party.checkedIn = true;
        yield party.save();
        res.status(200).send("Checked in");
    }
    else {
        res.status(404).send("Party not found");
    }
}));
app.get("/api/user/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const allUsersInfo = yield Waitlist.find();
        let user = {};
        let waitingPosition = 0;
        for (let index = 0; index < allUsersInfo.length; index++) {
            if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
                waitingPosition = waitingPosition + 1;
            }
            if (allUsersInfo[index].name === name) {
                user = allUsersInfo[index].toObject();
                console.log(user);
                if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
                    user = Object.assign(Object.assign({}, user), { waitingPosition: waitingPosition });
                }
                break;
            }
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
}));
// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
