import { EnumCount, EnumNotificationUser, EnumStatus } from "../dataTypes/enums";
import { calculateCount } from "../helpers/countHelper";
import { notificationService } from "../helpers/notificationHelper";
import { UsersList } from "../models/usersModel";
import { Notification } from "../observers/notificationObserver";

export const runScheduleService = (name: string, partySize: number) => {
  const totalSeatsCount = 10;
  const serviceTimePerPersonInMilliSec = 3000;
  setTimeout(async () => {
    const user = await UsersList.findOne({ name: name });
    if (user) {
      user.status = EnumStatus.ServiceCompleted;
      await user.save();
      const allUsers = await UsersList.find();
      const currentBookedSeatsCount = calculateCount(allUsers, EnumCount.BookedSeats);
      const currentCanCheckInSeatsCount = calculateCount(allUsers, EnumCount.CanCheckInSeats);
      const remainingSeatsCount = totalSeatsCount - (currentBookedSeatsCount + currentCanCheckInSeatsCount);
      const usersInWaiting = await UsersList.find({ status: EnumStatus.InWaitingList, canCheckIn: false });
      const notification = new Notification();
      notificationService(EnumNotificationUser.Self, [user], notification);
      notificationService(EnumNotificationUser.CanCheckInNow, usersInWaiting, notification, remainingSeatsCount);
      notificationService(EnumNotificationUser.StillInWaiting, usersInWaiting, notification);
    }
  }, serviceTimePerPersonInMilliSec * partySize);
};
