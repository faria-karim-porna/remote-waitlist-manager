import { IUser } from "../dataTypes/interfaces";
import { sendNotification } from "../server";
import { Observer, Subject } from "./observer";

export class Notification implements Subject<Partial<IUser>> {
  private observers: Observer<IUser>[] = [];

  attach(observer: Observer<IUser>): void {
    this.observers.push(observer);
  }

  detach(observer: Observer<IUser>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  detachAll(): void {
    this.observers = [];
  }

  notify(data?: Partial<IUser>, func?: (param: IUser, index?: number) => void): void {
    if (data) {
      this.observers.forEach((observer) => observer.update(data));
    } else if (func) {
      this.observers.forEach((observer, index) => {
        observer.update(undefined, () => func?.(observer?.getObserver, index));
      });
    }
  }
}

export class UsersObserver implements Observer<IUser> {
  private user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  get getObserver() {
    return this.user;
  }

  update(data?: Partial<IUser>, func?: () => void): void {
    if (data) {
      sendNotification(this.user.name ?? "", data);
    } else {
      func?.();
    }
  }
}
