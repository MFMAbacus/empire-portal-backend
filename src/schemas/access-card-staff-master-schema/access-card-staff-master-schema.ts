import mongoose, { Schema, Document } from "mongoose";

export interface IAccessCardStaffMaster extends Document {
  id: string;
  staffRole: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const AccessCardStaffMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    staffRole: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AccessCardStaffMaster =
  mongoose.models.AccessCardStaffMaster ||
  mongoose.model<IAccessCardStaffMaster>(
    "AccessCardStaffMaster",
    AccessCardStaffMasterSchema
  );

export default AccessCardStaffMaster;