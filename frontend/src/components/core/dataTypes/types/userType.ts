import { EnumStatus } from "../enums/userEnum";

export type User = {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  canCheckIn?: boolean;
  waitingPosition?: number;
};
