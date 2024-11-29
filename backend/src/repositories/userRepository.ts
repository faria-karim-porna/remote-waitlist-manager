import { IUser } from "../dataTypes/interfaces";
import { User } from "../dataTypes/types";
import { UsersList } from "../models/usersModel";

export const UserRepository = {
  findByName: async (name: string) => await UsersList.findOne({ name }),
  findByData: async (data: User) => await UsersList.find(data),
  findAll: async () => await UsersList.find(),
  createUser: async (data: User) => await new UsersList(data).save(),
  deleteUserByName: async (name: string) => await UsersList.deleteOne({ name }),
  updateUser: async (user: IUser) => await user.save(),
};
