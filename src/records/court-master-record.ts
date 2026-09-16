import { ObjectId } from "mongoose";

export type CourtMasterRecord = {
  _id?: ObjectId;
  id: string;
  courtId: string;
  courtName: string;
  courtType: string;
  location: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
