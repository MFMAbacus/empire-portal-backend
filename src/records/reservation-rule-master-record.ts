import { ObjectId } from "mongoose";

export type ReservationRuleMasterRecord = {
  _id?: ObjectId;
  id: string;
  slotDuration: number;
  maxGuest: number;
  lateArrival: number;
  venuId: string;
  isActive: boolean;
  isArchived: boolean;
};
