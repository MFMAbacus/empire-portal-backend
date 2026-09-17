import { ObjectId } from "mongoose";

export type CourtOperatingMasterRecord = {
  _id?: ObjectId;
  id: string;
  courtId: string;
  day: string;
  openTime: string;
  closeTime : string;
  isClosed: boolean;
  isActive: boolean;
  isArchived: boolean;
};
