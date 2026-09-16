import { ObjectId } from "mongoose";

export type ProjectCourtMasterRecord = {
  _id?: ObjectId;
  id: string;
  courtId: string;
  projectCode: string;
  isAccess: boolean;
  isActive: boolean;
  isArchived: boolean;
};
