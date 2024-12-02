import { EnumStatus } from "../dataTypes/enums";
import { IUser } from "../dataTypes/interfaces";
import { sendUpdatedWaitingPosition, updateCanCheckIn } from "../helpers/notificationHelper";
import { addObserversWhoCanCheckInNow, addObserversWhoStillInWaiting } from "../helpers/observerHelper";
import { Notification, UsersObserver } from "../observers/notificationObserver";

abstract class NotificationProcessor {
  public process(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    this.attach(users, notification, remainingSeatsCount);
    this.notify(notification);
    this.detachAll(notification);
  }

  protected abstract attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void;
  protected abstract notify(notification: Notification): void;
  protected abstract detachAll(notification: Notification): void;
}

export class SelfNotificationProcessor extends NotificationProcessor {
  protected attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    const observer = new UsersObserver(users[0]);
    notification.attach(observer);
  }

  protected notify(notification: Notification): void {
    notification.notify({ status: EnumStatus.ServiceCompleted });
  }

  protected detachAll(notification: Notification): void {
    notification.detachAll();
  }
}

export class CheckInNowNotificationProcessor extends NotificationProcessor {
  protected attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    addObserversWhoCanCheckInNow(users, notification, remainingSeatsCount);
  }

  protected notify(notification: Notification): void {
    notification.notify(undefined, updateCanCheckIn);
    notification.notify({ canCheckIn: true });
  }

  protected detachAll(notification: Notification): void {
    notification.detachAll();
  }
}

export class StillInWaitingNotificationProcessor extends NotificationProcessor {
  protected attach(users: IUser[], notification: Notification, remainingSeatsCount?: number): void {
    addObserversWhoStillInWaiting(users, notification);
  }

  protected notify(notification: Notification): void {
    notification.notify(undefined, sendUpdatedWaitingPosition);
  }

  protected detachAll(notification: Notification): void {
    notification.detachAll();
  }
}
