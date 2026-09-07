import mongoose, { Schema, Document } from "mongoose";

export interface IApprovalRoutingMaster extends Document {
  id: string;
  routingId: string;
  module: string;
  approverRole: string;
  approvalLevel?: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const ApprovalRoutingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    routingId: { type: String, required: true },
    module: { type: String, required: true },
    approverRole: { type: String, required: true },
    approvalLevel: { type: String, required: false, default: "" },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ApprovalRoutingMaster = mongoose.model<IApprovalRoutingMaster>(
  "ApprovalRoutingMaster",
  ApprovalRoutingMasterSchema
);

export default ApprovalRoutingMaster;