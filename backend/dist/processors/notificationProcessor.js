"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StillInWaitingNotificationProcessor = exports.CheckInNowNotificationProcessor = exports.SelfNotificationProcessor = void 0;
const enums_1 = require("../dataTypes/enums");
const notificationHelper_1 = require("../helpers/notificationHelper");
const observerHelper_1 = require("../helpers/observerHelper");
const notificationObserver_1 = require("../observers/notificationObserver");
class NotificationProcessor {
    process(users, notification, remainingSeatsCount) {
        this.attach(users, notification, remainingSeatsCount);
        this.notify(notification);
        this.detachAll(notification);
    }
}
class SelfNotificationProcessor extends NotificationProcessor {
    attach(users, notification, remainingSeatsCount) {
        const observer = new notificationObserver_1.UsersObserver(users[0]);
        notification.attach(observer);
    }
    notify(notification) {
        notification.notify({ status: enums_1.EnumStatus.ServiceCompleted });
    }
    detachAll(notification) {
        notification.detachAll();
    }
}
exports.SelfNotificationProcessor = SelfNotificationProcessor;
class CheckInNowNotificationProcessor extends NotificationProcessor {
    attach(users, notification, remainingSeatsCount) {
        (0, observerHelper_1.addObserversWhoCanCheckInNow)(users, notification, remainingSeatsCount);
    }
    notify(notification) {
        notification.notify(undefined, notificationHelper_1.updateCanCheckIn);
        notification.notify({ canCheckIn: true });
    }
    detachAll(notification) {
        notification.detachAll();
    }
}
exports.CheckInNowNotificationProcessor = CheckInNowNotificationProcessor;
class StillInWaitingNotificationProcessor extends NotificationProcessor {
    attach(users, notification, remainingSeatsCount) {
        (0, observerHelper_1.addObserversWhoStillInWaiting)(users, notification);
    }
    notify(notification) {
        notification.notify(undefined, notificationHelper_1.sendUpdatedWaitingPosition);
    }
    detachAll(notification) {
        notification.detachAll();
    }
}
exports.StillInWaitingNotificationProcessor = StillInWaitingNotificationProcessor;
