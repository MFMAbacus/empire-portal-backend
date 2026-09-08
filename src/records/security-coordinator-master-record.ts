import { ObjectId } from "mongoose";

export type SecurityCoordinatorMasterRecord = {
  _id?: ObjectId;
  id: string;
  coordinatorRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};