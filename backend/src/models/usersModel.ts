import { EnumStatus } from "../dataTypes/enums";
import { IUser } from "../dataTypes/interfaces";
import { model, Schema } from "mongoose";

const usersListSchema = new Schema({
  name: String,
  partySize: Number,
  status: { type: String, enum: Object.values(EnumStatus), default: EnumStatus.None },
  joinedAt: { type: Date, default: Date.now },
  canCheckIn: { type: Boolean, default: false },
});

export const UsersList = model<IUser>("UsersList", usersListSchema);
