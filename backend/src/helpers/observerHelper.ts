import { EnumStatus } from "../dataTypes/enums";
import { IUser } from "../dataTypes/interfaces";
import { Notification, UsersObserver } from "../observers/notificationObserver";

export const addObserversWhoCanCheckInNow = (users: IUser[], notification: Notification, remainingSeatsCount?: number) => {
  for (let index = 0; index < users.length; index++) {
    remainingSeatsCount = (remainingSeatsCount ?? 0) - (users[index].partySize ?? 0);
    if (remainingSeatsCount >= 0) {
      const observer = new UsersObserver(users[index]);
      notification.attach(observer);
    } else {
      break;
    }
  }
};

export const addObserversWhoStillInWaiting = (users: IUser[], notification: Notification) => {
  const usersStillInWaiting: IUser[] = [];
  for (let index = 0; index < users.length; index++) {
    if (users[index].status === EnumStatus.InWaitingList && users[index].canCheckIn === false) {
      const observer = new UsersObserver(users[index]);
      notification.attach(observer);
    }
  }

  return usersStillInWaiting;
};
