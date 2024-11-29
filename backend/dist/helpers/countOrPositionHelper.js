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
exports.calculateCount = exports.getUserWaitingPositionByName = void 0;
const enums_1 = require("../dataTypes/enums");
const userRepository_1 = require("../repositories/userRepository");
const calculateBookedSeatsCount = (allUsers) => {
    var _a, _b;
    let currentBookedSeatsCount = 0;
    for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === enums_1.EnumStatus.SeatIn) {
            currentBookedSeatsCount = currentBookedSeatsCount + ((_b = (_a = allUsers[index]) === null || _a === void 0 ? void 0 : _a.partySize) !== null && _b !== void 0 ? _b : 0);
        }
    }
    return currentBookedSeatsCount;
};
const calculateCanCheckInSeatsCount = (allUsers) => {
    var _a, _b;
    let currentCanCheckInSeatsCount = 0;
    for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === enums_1.EnumStatus.InWaitingList && allUsers[index].canCheckIn === true) {
            currentCanCheckInSeatsCount = currentCanCheckInSeatsCount + ((_b = (_a = allUsers[index]) === null || _a === void 0 ? void 0 : _a.partySize) !== null && _b !== void 0 ? _b : 0);
        }
    }
    return currentCanCheckInSeatsCount;
};
const calculateUsersInWaitingListCount = (allUsers) => {
    let usersInWaitingListCount = 0;
    for (let index = 0; index < allUsers.length; index++) {
        if (allUsers[index].status === enums_1.EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
            usersInWaitingListCount = usersInWaitingListCount + 1;
        }
    }
    return usersInWaitingListCount;
};
const getUserWaitingPositionByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const usersInWaitingList = yield userRepository_1.UserRepository.findByData({ status: enums_1.EnumStatus.InWaitingList, canCheckIn: false });
    const userIndex = usersInWaitingList.findIndex((user) => user.name === name);
    const waitingListPosition = userIndex + 1;
    return waitingListPosition;
});
exports.getUserWaitingPositionByName = getUserWaitingPositionByName;
const calculateCount = (users, type) => {
    let usersOrSeatsCount = 0;
    switch (type) {
        case enums_1.EnumCount.BookedSeats:
            usersOrSeatsCount = calculateBookedSeatsCount(users);
            break;
        case enums_1.EnumCount.CanCheckInSeats:
            usersOrSeatsCount = calculateCanCheckInSeatsCount(users);
            break;
        case enums_1.EnumCount.UsersInWaiting:
            usersOrSeatsCount = calculateUsersInWaitingListCount(users);
            break;
        default:
            break;
    }
    return usersOrSeatsCount;
};
exports.calculateCount = calculateCount;
