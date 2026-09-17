import { ObjectId } from "mongoose";

export type CourtBookingMasterRecord = {
  _id?: ObjectId;
  id: string;
  maxBooking: number;
  advanceBooking: number;
  projectCode: string;
  pendingSlot: boolean;
  isActive: boolean;
  isArchived: boolean;
};
