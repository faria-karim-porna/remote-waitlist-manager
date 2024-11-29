import { EnumStatus } from "./enums";

export type User = {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  joinedAt?: Date;
  canCheckIn?: boolean;
  waitingPosition?: number;
};
