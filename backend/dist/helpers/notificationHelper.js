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
exports.notificationService = exports.sendUpdatedWaitingPosition = exports.updateCanCheckIn = exports.sendNotification = void 0;
const socket_1 = require("../config/socket");
const enums_1 = require("../dataTypes/enums");
const notificationProcessor_1 = require("../processors/notificationProcessor");
const sendNotification = (name, data) => {
    const io = socket_1.SocketSingleton.getInstance();
    io.to(name !== null && name !== void 0 ? name : "").emit("notification", data);
};
exports.sendNotification = sendNotification;
const updateCanCheckIn = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.canCheckIn = true;
    yield user.save();
});
exports.updateCanCheckIn = updateCanCheckIn;
const sendUpdatedWaitingPosition = (user, index) => __awaiter(void 0, void 0, void 0, function* () {
    const name = user.name;
    (0, exports.sendNotification)(name !== null && name !== void 0 ? name : "", { waitingPosition: (index !== null && index !== void 0 ? index : 0) + 1 });
});
exports.sendUpdatedWaitingPosition = sendUpdatedWaitingPosition;
const notificationService = (userType, users, notification, remainingSeatsCount) => {
    switch (userType) {
        case enums_1.EnumNotificationUser.Self:
            const selfNotificationProcessor = new notificationProcessor_1.SelfNotificationProcessor();
            selfNotificationProcessor.process(users, notification, remainingSeatsCount);
            break;
        case enums_1.EnumNotificationUser.CanCheckInNow:
            const checkInNowNotificationProcessor = new notificationProcessor_1.CheckInNowNotificationProcessor();
            checkInNowNotificationProcessor.process(users, notification, remainingSeatsCount);
            break;
        case enums_1.EnumNotificationUser.StillInWaiting:
            const stillInWaitingNotificationProcessor = new notificationProcessor_1.StillInWaitingNotificationProcessor();
            stillInWaitingNotificationProcessor.process(users, notification, remainingSeatsCount);
            break;
        default:
            break;
    }
};
exports.notificationService = notificationService;
