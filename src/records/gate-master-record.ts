import { ObjectId } from "mongoose";

export type GateMasterRecord = {
  _id?: ObjectId;
  id: string;
  gateId: string;
  gateName: string;
  location: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
