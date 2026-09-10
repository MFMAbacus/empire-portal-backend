import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyManagementApprovalMaster extends Document {
  id: string;
  approverRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const PropertyManagementApprovalMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    approverRole: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PropertyManagementApprovalMaster =
  mongoose.models.PropertyManagementApprovalMaster ||
  mongoose.model<IPropertyManagementApprovalMaster>(
    "PropertyManagementApprovalMaster",
    PropertyManagementApprovalMasterSchema
  );

export default PropertyManagementApprovalMaster;