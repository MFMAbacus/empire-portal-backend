import { ObjectId } from "mongoose";

export type AccessCardStaffMasterRecord = {
  _id?: ObjectId;
  id: string;
  staffRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};