import { IUser } from "../dataTypes/interfaces";

export interface Observer<T> {
  get getObserver(): IUser;
  update(data?: Partial<T>, func?: () => void): void;
}

export interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  detachAll(): void;
  notify(data?: T, func?: (param: T, index?: number) => void): void;
}
