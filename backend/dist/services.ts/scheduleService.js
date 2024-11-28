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
exports.runScheduleService = void 0;
const enums_1 = require("../dataTypes/enums");
const countHelper_1 = require("../helpers/countHelper");
const notificationHelper_1 = require("../helpers/notificationHelper");
const usersModel_1 = require("../models/usersModel");
const notificationObserver_1 = require("../observers/notificationObserver");
const runScheduleService = (name, partySize) => {
    const totalSeatsCount = 10;
    const serviceTimePerPersonInMilliSec = 3000;
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield usersModel_1.UsersList.findOne({ name: name });
        if (user) {
            user.status = enums_1.EnumStatus.ServiceCompleted;
            yield user.save();
            const allUsers = yield usersModel_1.UsersList.find();
            const currentBookedSeatsCount = (0, countHelper_1.calculateCount)(allUsers, enums_1.EnumCount.BookedSeats);
            const currentCanCheckInSeatsCount = (0, countHelper_1.calculateCount)(allUsers, enums_1.EnumCount.CanCheckInSeats);
            const remainingSeatsCount = totalSeatsCount - (currentBookedSeatsCount + currentCanCheckInSeatsCount);
            const usersInWaiting = yield usersModel_1.UsersList.find({ status: enums_1.EnumStatus.InWaitingList, canCheckIn: false });
            const notification = new notificationObserver_1.Notification();
            (0, notificationHelper_1.notificationService)(enums_1.EnumNotificationUser.Self, [user], notification);
            (0, notificationHelper_1.notificationService)(enums_1.EnumNotificationUser.CanCheckInNow, usersInWaiting, notification, remainingSeatsCount);
            (0, notificationHelper_1.notificationService)(enums_1.EnumNotificationUser.StillInWaiting, usersInWaiting, notification);
        }
    }), serviceTimePerPersonInMilliSec * partySize);
};
exports.runScheduleService = runScheduleService;
