import { EnumCount, EnumStatus } from "../dataTypes/enums";
import { IUser } from "../dataTypes/interfaces";
import { UserRepository } from "../repositories/userRepository";

const calculateBookedSeatsCount = (allUsers: IUser[]) => {
  let currentBookedSeatsCount = 0;
  for (let index = 0; index < allUsers.length; index++) {
    if (allUsers[index].status === EnumStatus.SeatIn) {
      currentBookedSeatsCount = currentBookedSeatsCount + (allUsers[index]?.partySize ?? 0);
    }
  }
  return currentBookedSeatsCount;
};

const calculateCanCheckInSeatsCount = (allUsers: IUser[]) => {
  let currentCanCheckInSeatsCount = 0;
  for (let index = 0; index < allUsers.length; index++) {
    if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === true) {
      currentCanCheckInSeatsCount = currentCanCheckInSeatsCount + (allUsers[index]?.partySize ?? 0);
    }
  }
  return currentCanCheckInSeatsCount;
};

const calculateUsersInWaitingListCount = (allUsers: IUser[]) => {
  let usersInWaitingListCount = 0;
  for (let index = 0; index < allUsers.length; index++) {
    if (allUsers[index].status === EnumStatus.InWaitingList && allUsers[index].canCheckIn === false) {
      usersInWaitingListCount = usersInWaitingListCount + 1;
    }
  }
  return usersInWaitingListCount;
};

// const getUserWaitingPositionByName = async(name: string) => {
//   const allUsersInfo = await UserRepository.findByData();
// };

export const calculateCount = (users: IUser[], type: EnumCount) => {
  let usersOrSeatsCount = 0;
  switch (type) {
    case EnumCount.BookedSeats:
      usersOrSeatsCount = calculateBookedSeatsCount(users);
      break;
    case EnumCount.CanCheckInSeats:
      usersOrSeatsCount = calculateCanCheckInSeatsCount(users);
      break;
    case EnumCount.UsersInWaiting:
      usersOrSeatsCount = calculateUsersInWaitingListCount(users);
      break;
    default:
      break;
  }
  return usersOrSeatsCount;
};
