import mongoose, { Schema, Document } from "mongoose";

export interface IFacilityApprovalMaster extends Document {
  id: string;
  approverRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const FacilityApprovalMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    approverRole: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FacilityApprovalMaster =
  mongoose.models.FacilityApprovalMaster ||
  mongoose.model<IFacilityApprovalMaster>(
    "FacilityApprovalMaster",
    FacilityApprovalMasterSchema
  );

export default FacilityApprovalMaster;