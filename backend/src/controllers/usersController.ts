import { Request, Response } from "express";
import { calculateCount } from "../helpers/countOrPositionHelper";
import { EnumCount, EnumStatus } from "../dataTypes/enums";
import { User } from "../dataTypes/types";
import { runScheduleService } from "../services.ts/scheduleService";
import { UserRepository } from "../repositories/userRepository";

const joinUser = async (req: Request, res: Response) => {
  const totalSeatsCount = 10;
  const { name, partySize }: { name: string; partySize: number } = req.body;

  const allUserInfo = await UserRepository.findAll();

  const bookedSeatsCount = calculateCount(allUserInfo, EnumCount.BookedSeats);
  const canCheckInSeatsCount = calculateCount(allUserInfo, EnumCount.CanCheckInSeats);
  const usersInWaitingListCount = calculateCount(allUserInfo, EnumCount.UsersInWaiting);

  const availableSeatsCount = totalSeatsCount - (bookedSeatsCount + canCheckInSeatsCount);
  const isSeatAvailable = partySize <= availableSeatsCount;
  const isNoUserInWaiting = usersInWaitingListCount === 0;
  let newUser: User = {
    name: name,
    partySize: partySize,
  };
  const canSeatIn = isSeatAvailable && isNoUserInWaiting;
  if (canSeatIn) {
    newUser = { ...newUser, status: EnumStatus.SeatIn };
    await UserRepository.createUser(newUser);
    res.status(201).json({ message: "New user has been added", user: newUser });
    runScheduleService(name, partySize);
  } else {
    const waitingListLastPosition = (await UserRepository.findByData({ status: EnumStatus.InWaitingList, canCheckIn: false })).length;
    newUser = { ...newUser, status: EnumStatus.InWaitingList, canCheckIn: false, waitingPosition: waitingListLastPosition + 1 };
    const { waitingPosition, ...userWithoutPosition } = newUser;
    await UserRepository.createUser(userWithoutPosition);
    res.status(201).json({ message: "New user has been added", user: newUser });
  }
};

const checkInUser = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = await UserRepository.findByName(name);
  if (user) {
    user.status = EnumStatus.SeatIn;
    await UserRepository.updateUser(user);
    res.status(200).send({ message: "User has checked in", user: user });
    runScheduleService(name, user.partySize ?? 0);
  } else {
    res.status(404).send({ message: "User not found" });
  }
};

const getUser = async (req: Request<{ name: string }>, res: Response): Promise<any> => {
  const { name } = req.params;

  try {
    const allUsersInfo = await UserRepository.findAll();
    let user: User = {};
    let waitingPosition = 0;

    for (let index = 0; index < allUsersInfo.length; index++) {
      if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
        waitingPosition = waitingPosition + 1;
      }
      if (allUsersInfo[index].name === name) {
        user = allUsersInfo[index].toObject() as User;
        if (allUsersInfo[index].status === EnumStatus.InWaitingList && allUsersInfo[index].canCheckIn === false) {
          user = { ...user, waitingPosition: waitingPosition };
        }
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = await UserRepository.deleteUserByName(name);
  if (user) {
    res.status(200).send({ message: "User has been deleted" });
  } else {
    res.status(404).send({ message: "User not found" });
  }
};

export { joinUser, checkInUser, getUser, deleteUser };
