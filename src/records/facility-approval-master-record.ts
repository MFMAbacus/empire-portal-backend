import { ObjectId } from "mongoose";

export type FacilityApprovalMasterRecord = {
  _id?: ObjectId;
  id: string;
  approverRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};