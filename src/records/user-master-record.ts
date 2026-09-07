import { ObjectId } from "mongoose";

export type UserMasterRecord = {
  _id?: ObjectId;
  id: string;
  userId: string;
  name: string;
  role: string;
  assignedModule: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
