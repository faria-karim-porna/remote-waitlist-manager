"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addObserversWhoStillInWaiting = exports.addObserversWhoCanCheckInNow = void 0;
const enums_1 = require("../dataTypes/enums");
const notificationObserver_1 = require("../observers/notificationObserver");
const addObserversWhoCanCheckInNow = (users, notification, remainingSeatsCount) => {
    var _a;
    for (let index = 0; index < users.length; index++) {
        remainingSeatsCount = (remainingSeatsCount !== null && remainingSeatsCount !== void 0 ? remainingSeatsCount : 0) - ((_a = users[index].partySize) !== null && _a !== void 0 ? _a : 0);
        if (remainingSeatsCount >= 0) {
            const observer = new notificationObserver_1.UsersObserver(users[index]);
            notification.attach(observer);
        }
        else {
            break;
        }
    }
};
exports.addObserversWhoCanCheckInNow = addObserversWhoCanCheckInNow;
const addObserversWhoStillInWaiting = (users, notification) => {
    const usersStillInWaiting = [];
    for (let index = 0; index < users.length; index++) {
        if (users[index].status === enums_1.EnumStatus.InWaitingList && users[index].canCheckIn === false) {
            const observer = new notificationObserver_1.UsersObserver(users[index]);
            notification.attach(observer);
        }
    }
    return usersStillInWaiting;
};
exports.addObserversWhoStillInWaiting = addObserversWhoStillInWaiting;
