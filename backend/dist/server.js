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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("join", (name) => {
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
var EnumStatus;
(function (EnumStatus) {
    EnumStatus["None"] = "None";
    EnumStatus["SeatIn"] = "Seat In";
    EnumStatus["InWaitingList"] = "In Waiting List";
    EnumStatus["ServiceCompleted"] = "Service Completed";
})(EnumStatus || (EnumStatus = {}));
const usersListSchema = new mongoose_1.default.Schema({
    name: String,
    partySize: Number,
    status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
    joinedAt: { type: Date, default: Date.now },
    canCheckIn: { type: Boolean, default: false },
});
const UsersList = mongoose_1.default.model("UsersList", usersListSchema);
// const seatsCountSchema = new mongoose.Schema({
//   bookedSeats: { type: Number, default: 0 },
//   inWaitingSeats: { type: Number, default: 0 },
// });
// const SeatsCount = mongoose.model("SeatsCount", seatsCountSchema);
const runServiceSchedule = (name, partySize) => {
    const totalSeatsCount = 10;
    const serviceTimePerPersonInMilliSec = 3000;
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const user = yield UsersList.findOne({ name: name });
        if (user) {
            user.status = EnumStatus.ServiceCompleted;
            yield user.save();
            io.to(name).emit("notification", { status: EnumStatus.ServiceCompleted });
            const allUsers = yield UsersList.find();
            let currentBookedSeatsCount = 0;
            let currentCanCheckInSeatsCount = 0;
            let userWaitingPosition = 0;
            for (let index = 0; index < allUsers.length; index++) {
                if (allUsers[index].status === EnumStatus.SeatIn) {
                    currentBookedSeatsCount = currentBookedSeatsCount + ((_b = (_a = allUsers[index]) === null || _a === void 0 ? void 0 : _a.partySize) !== null && _b !== void 0 ? _b : 0);
                }
                if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === true) {
                    currentCanCheckInSeatsCount = currentCanCheckInSeatsCount + ((_d = (_c = allUsers[index]) === null || _c === void 0 ? void 0 : _c.partySize) !== null && _d !== void 0 ? _d : 0);
                }
            }
            let remainingSeatsCount = totalSeatsCount - (currentBookedSeatsCount + currentCanCheckInSeatsCount);
            for (let index = 0; index < allUsers.length; index++) {
                if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
                    remainingSeatsCount = remainingSeatsCount - ((_e = allUsers[index].partySize) !== null && _e !== void 0 ? _e : 0);
                    if (remainingSeatsCount >= 0) {
                        allUsers[index].canCheckIn = true;
                        yield allUsers[index].save();
                        io.to((_f = allUsers[index].name) !== null && _f !== void 0 ? _f : "").emit("notification", { canCheckIn: true });
                    }
                    else {
                        break;
                    }
                }
            }
            for (let index = 0; index < allUsers.length; index++) {
                if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
                    userWaitingPosition = userWaitingPosition + 1;
                    if (allUsers[index] && allUsers[index].name) {
                        io.to((_g = allUsers[index].name) !== null && _g !== void 0 ? _g : "").emit("notification", { waitingPosition: userWaitingPosition });
                    }
                }
            }
        }
    }), serviceTimePerPersonInMilliSec * partySize);
};
app.post("/api/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const totalSeatsCount = 10;
    const { name, partySize } = req.body;
    let bookedSeatsCount = 0;
    let canCheckInSeatsCount = 0;
    let usersInWaitingListCount = 0;
    const allUserInfo = yield UsersList.find();
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
        const newUserEntry = new UsersList(Object.assign({}, newUser));
        yield newUserEntry.save();
        res.status(201).json({ message: "New user has been added", user: newUser });
        runServiceSchedule(name, partySize);
    }
    else {
        const waitingListLastPosition = (yield UsersList.find({ status: EnumStatus.InWaitingList, canCheckIn: false })).length;
        newUser = Object.assign(Object.assign({}, newUser), { status: EnumStatus.InWaitingList, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 });
        const { waitingPosition } = newUser, userWithoutPosition = __rest(newUser, ["waitingPosition"]);
        const newUserEntry = new UsersList(Object.assign({}, userWithoutPosition));
        yield newUserEntry.save();
        res.status(201).json({ message: "New user has been added", user: newUser });
    }
}));
app.post("/api/checkin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    const user = yield UsersList.findOne({ name: name });
    if (user) {
        user.status = EnumStatus.SeatIn;
        yield user.save();
        res.status(200).send({ message: "User has checked in", user: user });
        runServiceSchedule(name, (_a = user.partySize) !== null && _a !== void 0 ? _a : 0);
    }
    else {
        res.status(404).send({ message: "User not found" });
    }
}));
app.get("/api/user/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const allUsersInfo = yield UsersList.find();
        let user = {};
        let waitingPosition = 0;
        for (let index = 0; index < allUsersInfo.length; index++) {
            if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
                waitingPosition = waitingPosition + 1;
            }
            if (allUsersInfo[index].name === name) {
                user = allUsersInfo[index].toObject();
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
app.delete("/api/deleteUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const user = yield UsersList.deleteOne({ name: name });
    if (user) {
        res.status(200).send({ message: "User has been deleted" });
    }
    else {
        res.status(404).send({ message: "User not found" });
    }
}));
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
