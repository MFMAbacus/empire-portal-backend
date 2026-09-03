import { ObjectId } from "mongoose";

export type PropertyMasterRecord = {
  _id?: ObjectId;
  id: string;
  projectCode: string;
  projectName: string;
  propertyName: string;
  isActive: boolean;
  isArchived: boolean;
};
