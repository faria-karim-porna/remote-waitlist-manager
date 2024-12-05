import { EnumStatus } from "./enums";
import { Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    partySize?: number;
    status?: EnumStatus;
    joinedAt?: Date;
    canCheckIn?: boolean;
    waitingPosition?: number;
  }