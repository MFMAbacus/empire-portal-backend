import { ObjectId } from "mongoose";

export type CourtBlockingMasterRecord = {
  _id?: ObjectId;
  id: string;
  blockId: string;
  blockDate: string;
  startTime: string;
  endTime: string;
  courtId: string;
  reason: string;
  createdBy: string;
  isActive: boolean;
  isArchived: boolean;
};
