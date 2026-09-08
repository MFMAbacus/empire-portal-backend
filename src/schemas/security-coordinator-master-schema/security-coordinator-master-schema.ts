import mongoose, { Schema, Document } from "mongoose";

export interface ISecurityCoordinatorMaster extends Document {
  id: string;
  coordinatorRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const SecurityCoordinatorMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    coordinatorRole: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SecurityCoordinatorMaster =
  mongoose.models.SecurityCoordinatorMaster ||
  mongoose.model<ISecurityCoordinatorMaster>(
    "SecurityCoordinatorMaster",
    SecurityCoordinatorMasterSchema
  );

export default SecurityCoordinatorMaster;