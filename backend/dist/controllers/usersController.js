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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.checkInUser = exports.joinUser = void 0;
const countOrPositionHelper_1 = require("../helpers/countOrPositionHelper");
const enums_1 = require("../dataTypes/enums");
const scheduleService_1 = require("../services.ts/scheduleService");
const userRepository_1 = require("../repositories/userRepository");
const joinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalSeatsCount = 10;
        const { name, partySize } = req.body;
        const allUserInfo = yield userRepository_1.UserRepository.findAll();
        const bookedSeatsCount = (0, countOrPositionHelper_1.calculateCount)(allUserInfo, enums_1.EnumCount.BookedSeats);
        const canCheckInSeatsCount = (0, countOrPositionHelper_1.calculateCount)(allUserInfo, enums_1.EnumCount.CanCheckInSeats);
        const usersInWaitingListCount = (0, countOrPositionHelper_1.calculateCount)(allUserInfo, enums_1.EnumCount.UsersInWaiting);
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
            yield userRepository_1.UserRepository.createUser(newUser);
            res.status(201).json({ message: "New user has been added", user: newUser });
            (0, scheduleService_1.runScheduleService)(name, partySize);
        }
        else {
            newUser = Object.assign(Object.assign({}, newUser), { status: enums_1.EnumStatus.InWaitingList, canCheckIn: false });
            yield userRepository_1.UserRepository.createUser(newUser);
            const waitingPosition = yield (0, countOrPositionHelper_1.getUserWaitingPositionByName)(name);
            newUser = Object.assign(Object.assign({}, newUser), { waitingPosition: waitingPosition });
            res.status(201).json({ message: "New user has been added", user: newUser });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add user", error: error });
    }
});
exports.joinUser = joinUser;
const checkInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = req.body;
        const user = yield userRepository_1.UserRepository.findByName(name);
        if (user) {
            user.status = enums_1.EnumStatus.SeatIn;
            yield userRepository_1.UserRepository.updateUser(user);
            res.status(200).send({ message: "User has checked in", user: user });
            (0, scheduleService_1.runScheduleService)(name, (_a = user.partySize) !== null && _a !== void 0 ? _a : 0);
        }
        else {
            res.status(404).send({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to check in user", error: error });
    }
});
exports.checkInUser = checkInUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const userInfo = yield userRepository_1.UserRepository.findByName(name);
        let user = {};
        if (userInfo) {
            user = userInfo.toObject();
        }
        const waitingPosition = yield (0, countOrPositionHelper_1.getUserWaitingPositionByName)(name);
        user = Object.assign(Object.assign({}, user), { waitingPosition: waitingPosition });
        res.status(200).json({ user: user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const user = yield userRepository_1.UserRepository.deleteUserByName(name);
        if (user) {
            res.status(200).send({ message: "User has been deleted" });
        }
        else {
            res.status(404).send({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error });
    }
});
exports.deleteUser = deleteUser;
