import { ObjectId } from "mongoose";

export type PropertyManagementApprovalMasterRecord = {
  _id?: ObjectId;
  id: string;
  approverRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};