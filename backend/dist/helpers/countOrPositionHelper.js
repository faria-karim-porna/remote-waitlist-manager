"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCount = void 0;
const enums_1 = require("../dataTypes/enums");
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
// const getUserWaitingPositionByName = async(name: string) => {
//   const allUsersInfo = await UserRepository.findByData();
// };
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
