import { Server } from "socket.io";
import { IUser } from "../dataTypes/interfaces";

// export const sendNotification = (name: string, data: Partial<IUser>, io: Server) => {
//   io.to(name ?? "").emit("notification", data);
// };

// const updateCanCheckIn = async (user: IUser) => {
//   user.canCheckIn = true;
//   await user.save();
// };

// const sendUpdatedWaitingPosition = async (user: IUser, index?: number) => {
//   const name = user.name;
//   sendNotification(name ?? "", { waitingPosition: (index ?? 0) + 1 });
// };
