"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumCount = exports.EnumNotificationUser = exports.EnumStatus = void 0;
var EnumStatus;
(function (EnumStatus) {
    EnumStatus["None"] = "None";
    EnumStatus["SeatIn"] = "Seat In";
    EnumStatus["InWaitingList"] = "In Waiting List";
    EnumStatus["ServiceCompleted"] = "Service Completed";
})(EnumStatus || (exports.EnumStatus = EnumStatus = {}));
var EnumNotificationUser;
(function (EnumNotificationUser) {
    EnumNotificationUser["Self"] = "Self";
    EnumNotificationUser["CanCheckInNow"] = "Can Check In Now";
    EnumNotificationUser["StillInWaiting"] = "Still In Waiting";
})(EnumNotificationUser || (exports.EnumNotificationUser = EnumNotificationUser = {}));
var EnumCount;
(function (EnumCount) {
    EnumCount["BookedSeats"] = "Booked Seats";
    EnumCount["CanCheckInSeats"] = "Can Check In Seats";
    EnumCount["UsersInWaiting"] = "Users In Waiting";
})(EnumCount || (exports.EnumCount = EnumCount = {}));
