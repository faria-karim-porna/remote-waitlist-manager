import { Request, Response } from "express";
import { calculateCount, getUserWaitingPositionByName } from "../helpers/countOrPositionHelper";
import { EnumCount, EnumStatus } from "../dataTypes/enums";
import { User } from "../dataTypes/types";
import { runScheduleService } from "../services.ts/scheduleService";
import { UserRepository } from "../repositories/userRepository";

const joinUser = async (req: Request, res: Response) => {
  try {
    const totalSeatsCount = 10;
    const { name, partySize }: { name: string; partySize: number } = req.body;
    const user = await UserRepository.findByName(name);
    if (user) {
      res.status(409).json({ message: "Username already exist. Please choose a different one."});
      return;
    } else {
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
        newUser = {
          ...newUser,
          status: EnumStatus.InWaitingList,
          canCheckIn: false,
        };
        await UserRepository.createUser(newUser);

        const waitingPosition = await getUserWaitingPositionByName(name);
        newUser = { ...newUser, waitingPosition: waitingPosition };

        res.status(201).json({ message: "New user has been added", user: newUser });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add user", error: error });
  }
};

const checkInUser = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to check in user", error: error });
  }
};

const getUser = async (req: Request<{ name: string }>, res: Response) => {
  try {
    const { name } = req.params;
    const userInfo = await UserRepository.findByName(name);
    let user: User = {};

    if (userInfo) {
      user = userInfo.toObject() as User;
    }
    const waitingPosition = await getUserWaitingPositionByName(name);
    user = { ...user, waitingPosition: waitingPosition };

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const user = await UserRepository.deleteUserByName(name);

    if (user) {
      res.status(200).send({ message: "User has been deleted" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error });
  }
};

export { joinUser, checkInUser, getUser, deleteUser };
