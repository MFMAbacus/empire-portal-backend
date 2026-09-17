import { ObjectId } from "mongoose";

export type CourtTimeMasterRecord = {
  _id?: ObjectId;
  id: string;
  courtId: string;
  startTime: string;
  endTime : string;
  slotDuration: number;
  isActive: boolean;
  isArchived: boolean;
};
