import { ObjectId } from "mongoose";

export type ApprovalRoutingMasterRecord = {
  _id?: ObjectId;
  routingId: string;
  module: string;
  approverRole: string;
  approvalLevel: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
