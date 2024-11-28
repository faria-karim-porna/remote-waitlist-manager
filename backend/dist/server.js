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
// ============================ mongodb nodejs connection =====================================
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
// ============================ Socket.io nodejs connection =====================================
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("join", (name) => {
        console.log(`${socket.id} joined ${name}`);
        socket.join(name);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
// ============================ enums =====================================
var EnumStatus;
(function (EnumStatus) {
    EnumStatus["None"] = "None";
    EnumStatus["SeatIn"] = "Seat In";
    EnumStatus["InWaitingList"] = "In Waiting List";
    EnumStatus["ServiceCompleted"] = "Service Completed";
})(EnumStatus || (EnumStatus = {}));
var EnumNotificationUser;
(function (EnumNotificationUser) {
    EnumNotificationUser["Self"] = "Self";
    EnumNotificationUser["CanCheckInNow"] = "Can Check In Now";
    EnumNotificationUser["StillInWaiting"] = "Still In Waiting";
})(EnumNotificationUser || (EnumNotificationUser = {}));
var EnumCount;
(function (EnumCount) {
    EnumCount["BookedSeats"] = "Booked Seats";
    EnumCount["CanCheckInSeats"] = "Can Check In Seats";
    EnumCount["UsersInWaiting"] = "Users In Waiting";
})(EnumCount || (EnumCount = {}));
// ============================ models =====================================
const usersListSchema = new mongoose_1.default.Schema({
    name: String,
    partySize: Number,
    status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
    joinedAt: { type: Date, default: Date.now },
    canCheckIn: { type: Boolean, default: false },
});
const UsersList = mongoose_1.default.model("UsersList", usersListSchema);
class Notification {
    constructor() {
        this.observers = [];
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }
    detachAll() {
        this.observers = [];
    }
    notify(data, func) {
        if (data) {
            this.observers.forEach((observer) => observer.update(data));
        }
        else if (func) {
            this.observers.forEach((observer, index) => {
                observer.update(undefined, () => func === null || func === void 0 ? void 0 : func(observer === null || observer === void 0 ? void 0 : observer.getObserver, index));
            });
        }
    }
}
class UsersObserver {
    constructor(user) {
        this.user = user;
    }
    get getObserver() {
        return this.user;
    }
    update(data, func) {
        var _a;
        if (data) {
            sendNotification((_a = this.user.name) !== null && _a !== void 0 ? _a : "", data);
        }
        else {
            func === null || func === void 0 ? void 0 : func();
        }
    }
}
const addObserversWhoCanCheckInNow = (users, notification, remainingSeatsCount) => {
    var _a;
    for (let index = 0; index < users.length; index++) {
        remainingSeatsCount = (remainingSeatsCount !== null && remainingSeatsCount !== void 0 ? remainingSeatsCount : 0) - ((_a = users[index].partySize) !== null && _a !== void 0 ? _a : 0);
        if (remainingSeatsCount >= 0) {
            const observer = new UsersObserver(users[index]);
            notification.attach(observer);
        }
        else {
            break;
        }
    }
};
const addObserversWhoStillInWaiting = (users, notification) => {
    const usersStillInWaiting = [];
    for (let index = 0; index < users.length; index++) {
        if (users[index].status === EnumStatus.InWaitingList && users[index].canCheckIn === false) {
            const observer = new UsersObserver(users[index]);
            notification.attach(observer);
        }
    }
    return usersStillInWaiting;
};
// ============================ template method design pattern =====================================
class NotificationProcessor {
    process(users, notification, remainingSeatsCount) {
        this.attach(users, notification, remainingSeatsCount);
        this.notify(notification);
        this.detachAll(notification);
    }
}
class SelfNotificationProcessor extends NotificationProcessor {
    attach(users, notification, remainingSeatsCount) {
        const observer = new UsersObserver(users[0]);
        notification.attach(observer);
    }
    notify(notification) {
        notification.notify({ status: EnumStatus.ServiceCompleted });
    }
    detachAll(notification) {
        notification.detachAll();
    }
}
class CheckInNowNotificationProcessor extends NotificationProcessor {
    attach(users, notification, remainingSeatsCount) {
        addObserversWhoCanCheckInNow(users, notification, remainingSeatsCount);
    }
    notify(notification) {
        notification.notify(undefined, updateCanCheckIn);
        notification.notify({ canCheckIn: true });
    }
    detachAll(notification) {
        notification.detachAll();
    }
}
class StillInWaitingNotificationProcessor extends NotificationProcessor {
    attach(users, notification, remainingSeatsCount) {
        addObserversWhoStillInWaiting(users, notification);
    }
    notify(notification) {
        notification.notify(undefined, sendUpdatedWaitingPosition);
    }
    detachAll(notification) {
        notification.detachAll();
    }
}
// ============================ notification helpers =====================================
const sendNotification = (name, data) => {
    io.to(name !== null && name !== void 0 ? name : "").emit("notification", data);
};
const updateCanCheckIn = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.canCheckIn = true;
    yield user.save();
});
const sendUpdatedWaitingPosition = (user, index) => __awaiter(void 0, void 0, void 0, function* () {
    const name = user.name;
    sendNotification(name !== null && name !== void 0 ? name : "", { waitingPosition: (index !== null && index !== void 0 ? index : 0) + 1 });
});
const notificationService = (userType, users, notification, remainingSeatsCount) => {
    switch (userType) {
        case EnumNotificationUser.Self:
            const selfNotificationProcessor = new SelfNotificationProcessor();
            selfNotificationProcessor.process(users, notification, remainingSeatsCount);
            // const observer = new UsersObserver(users[0]);
            // notification.attach(observer);
            // notification.notify({ status: EnumStatus.ServiceCompleted });
            // notification.detachAll();
            break;
        case EnumNotificationUser.CanCheckInNow:
            const checkInNowNotificationProcessor = new CheckInNowNotificationProcessor();
            checkInNowNotificationProcessor.process(users, notification, remainingSeatsCount);
            // addObserversWhoCanCheckInNow(users, notification, remainingSeatsCount);
            // notification.notify(undefined, updateCanCheckIn);
            // notification.notify({ canCheckIn: true });
            // notification.detachAll();
            break;
        case EnumNotificationUser.StillInWaiting:
            const stillInWaitingNotificationProcessor = new StillInWaitingNotificationProcessor();
            stillInWaitingNotificationProcessor.process(users, notification, remainingSeatsCount);
            // addObserversWhoStillInWaiting(users, notification);
            // notification.notify(undefined, sendUpdatedWaitingPosition);
            // notification.detachAll();
            break;
        default:
            break;
    }
};
// ============================ count helpers =====================================
const calculateBookedSeatsCount = (allUsers) => {
    var _a, _b;
    let currentBookedSeatsCount = 0;
    for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === EnumStatus.SeatIn) {
            currentBookedSeatsCount = currentBookedSeatsCount + ((_b = (_a = allUsers[index]) === null || _a === void 0 ? void 0 : _a.partySize) !== null && _b !== void 0 ? _b : 0);
        }
    }
    return currentBookedSeatsCount;
};
const calculateCanCheckInSeatsCount = (allUsers) => {
    var _a, _b;
    let currentCanCheckInSeatsCount = 0;
    for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === true) {
            currentCanCheckInSeatsCount = currentCanCheckInSeatsCount + ((_b = (_a = allUsers[index]) === null || _a === void 0 ? void 0 : _a.partySize) !== null && _b !== void 0 ? _b : 0);
        }
    }
    return currentCanCheckInSeatsCount;
};
const calculateUsersInWaitingListCount = (allUsers) => {
    let usersInWaitingListCount = 0;
    for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
            usersInWaitingListCount = usersInWaitingListCount + 1;
        }
    }
    return usersInWaitingListCount;
};
const calculateCount = (users, type) => {
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
const runServiceSchedule = (name, partySize) => {
    const totalSeatsCount = 10;
    const serviceTimePerPersonInMilliSec = 3000;
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UsersList.findOne({ name: name });
        if (user) {
            user.status = EnumStatus.ServiceCompleted;
            yield user.save();
            const allUsers = yield UsersList.find();
            const currentBookedSeatsCount = calculateCount(allUsers, EnumCount.BookedSeats);
            const currentCanCheckInSeatsCount = calculateCount(allUsers, EnumCount.CanCheckInSeats);
            let remainingSeatsCount = totalSeatsCount - (currentBookedSeatsCount + currentCanCheckInSeatsCount);
            const usersInWaiting = yield UsersList.find({ status: EnumStatus.InWaitingList, canCheckIn: false });
            const notification = new Notification();
            notificationService(EnumNotificationUser.Self, [user], notification);
            notificationService(EnumNotificationUser.CanCheckInNow, usersInWaiting, notification, remainingSeatsCount);
            notificationService(EnumNotificationUser.StillInWaiting, usersInWaiting, notification);
        }
    }), serviceTimePerPersonInMilliSec * partySize);
};
// ============================ API =====================================
app.post("/api/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalSeatsCount = 10;
    const { name, partySize } = req.body;
    const allUserInfo = yield UsersList.find();
    const bookedSeatsCount = calculateCount(allUserInfo, EnumCount.BookedSeats);
    const canCheckInSeatsCount = calculateCount(allUserInfo, EnumCount.CanCheckInSeats);
    const usersInWaitingListCount = calculateCount(allUserInfo, EnumCount.UsersInWaiting);
    const availableSeatsCount = totalSeatsCount - (bookedSeatsCount + canCheckInSeatsCount);
    const isSeatAvailable = partySize <= availableSeatsCount;
    const isNoUserInWaiting = usersInWaitingListCount === 0;
    let newUser = {
        name: name,
        partySize: partySize,
    };
    const canSeatIn = isSeatAvailable && isNoUserInWaiting;
    if (canSeatIn) {
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
