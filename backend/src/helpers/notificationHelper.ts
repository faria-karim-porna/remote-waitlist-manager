import { SocketSingleton } from "../config/socket";
import { EnumNotificationUser } from "../dataTypes/enums";
import { IUser } from "../dataTypes/interfaces";
import { Notification } from "../observers/notificationObserver";
import {
  CheckInNowNotificationProcessor,
  SelfNotificationProcessor,
  StillInWaitingNotificationProcessor,
} from "../processors/notificationProcessor";

export const sendNotification = (name: string, data: Partial<IUser>) => {
  const io = SocketSingleton.getInstance();
  io.to(name ?? "").emit("notification", data);
};

export const updateCanCheckIn = async (user: IUser) => {
  user.canCheckIn = true;
  await user.save();
};

export const sendUpdatedWaitingPosition = async (user: IUser, index?: number) => {
  const name = user.name;
  sendNotification(name ?? "", { waitingPosition: (index ?? 0) + 1 });
};

export const notificationService = (
  userType: EnumNotificationUser,
  users: IUser[],
  notification: Notification,
  remainingSeatsCount?: number
) => {
  switch (userType) {
    case EnumNotificationUser.Self:
      const selfNotificationProcessor = new SelfNotificationProcessor();
      selfNotificationProcessor.process(users, notification, remainingSeatsCount);
      break;
    case EnumNotificationUser.CanCheckInNow:
      const checkInNowNotificationProcessor = new CheckInNowNotificationProcessor();
      checkInNowNotificationProcessor.process(users, notification, remainingSeatsCount);
      break;
    case EnumNotificationUser.StillInWaiting:
      const stillInWaitingNotificationProcessor = new StillInWaitingNotificationProcessor();
      stillInWaitingNotificationProcessor.process(users, notification, remainingSeatsCount);
      break;
    default:
      break;
  }
};
