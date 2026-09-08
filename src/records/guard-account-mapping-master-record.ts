import { ObjectId } from "mongoose";

export type GuardAccountMappingMasterRecord = {
  _id?: ObjectId;
  id: string;
  guardAccountId: string;
  guardUserId: string;
  gateId: string;
  deviceId: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
