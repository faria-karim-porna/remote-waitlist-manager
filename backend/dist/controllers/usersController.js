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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.checkInUser = exports.joinUser = void 0;
const usersModel_1 = require("../models/usersModel");
const countHelper_1 = require("../helpers/countHelper");
const enums_1 = require("../dataTypes/enums");
const scheduleService_1 = require("../services.ts/scheduleService");
const joinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalSeatsCount = 10;
    const { name, partySize } = req.body;
    const allUserInfo = yield usersModel_1.UsersList.find();
    const bookedSeatsCount = (0, countHelper_1.calculateCount)(allUserInfo, enums_1.EnumCount.BookedSeats);
    const canCheckInSeatsCount = (0, countHelper_1.calculateCount)(allUserInfo, enums_1.EnumCount.CanCheckInSeats);
    const usersInWaitingListCount = (0, countHelper_1.calculateCount)(allUserInfo, enums_1.EnumCount.UsersInWaiting);
    const availableSeatsCount = totalSeatsCount - (bookedSeatsCount + canCheckInSeatsCount);
    const isSeatAvailable = partySize <= availableSeatsCount;
    const isNoUserInWaiting = usersInWaitingListCount === 0;
    let newUser = {
        name: name,
        partySize: partySize,
    };
    const canSeatIn = isSeatAvailable && isNoUserInWaiting;
    if (canSeatIn) {
        newUser = Object.assign(Object.assign({}, newUser), { status: enums_1.EnumStatus.SeatIn });
        const newUserEntry = new usersModel_1.UsersList(Object.assign({}, newUser));
        yield newUserEntry.save();
        res.status(201).json({ message: "New user has been added", user: newUser });
        (0, scheduleService_1.runScheduleService)(name, partySize);
    }
    else {
        const waitingListLastPosition = (yield usersModel_1.UsersList.find({ status: enums_1.EnumStatus.InWaitingList, canCheckIn: false })).length;
        newUser = Object.assign(Object.assign({}, newUser), { status: enums_1.EnumStatus.InWaitingList, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 });
        const { waitingPosition } = newUser, userWithoutPosition = __rest(newUser, ["waitingPosition"]);
        const newUserEntry = new usersModel_1.UsersList(Object.assign({}, userWithoutPosition));
        yield newUserEntry.save();
        res.status(201).json({ message: "New user has been added", user: newUser });
    }
});
exports.joinUser = joinUser;
const checkInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    const user = yield usersModel_1.UsersList.findOne({ name: name });
    if (user) {
        user.status = enums_1.EnumStatus.SeatIn;
        yield user.save();
        res.status(200).send({ message: "User has checked in", user: user });
        (0, scheduleService_1.runScheduleService)(name, (_a = user.partySize) !== null && _a !== void 0 ? _a : 0);
    }
    else {
        res.status(404).send({ message: "User not found" });
    }
});
exports.checkInUser = checkInUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const allUsersInfo = yield usersModel_1.UsersList.find();
        let user = {};
        let waitingPosition = 0;
        for (let index = 0; index < allUsersInfo.length; index++) {
            if (allUsersInfo[index].status === enums_1.EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
                waitingPosition = waitingPosition + 1;
            }
            if (allUsersInfo[index].name === name) {
                user = allUsersInfo[index].toObject();
                if (allUsersInfo[index].status === enums_1.EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
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
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const user = yield usersModel_1.UsersList.deleteOne({ name: name });
    if (user) {
        res.status(200).send({ message: "User has been deleted" });
    }
    else {
        res.status(404).send({ message: "User not found" });
    }
});
exports.deleteUser = deleteUser;
