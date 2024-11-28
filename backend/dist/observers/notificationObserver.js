"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersObserver = exports.Notification = void 0;
const server_1 = require("../server");
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
exports.Notification = Notification;
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
            (0, server_1.sendNotification)((_a = this.user.name) !== null && _a !== void 0 ? _a : "", data);
        }
        else {
            func === null || func === void 0 ? void 0 : func();
        }
    }
}
exports.UsersObserver = UsersObserver;
