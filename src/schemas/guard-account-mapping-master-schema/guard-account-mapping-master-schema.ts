import mongoose, { Schema, Document } from "mongoose";

export interface IGuardAccountMappingMaster extends Document {
  id: string;
  guardAccountId: string;
  guardUserId: string;
  deviceId: string;
  gateId: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const GuardAccountMappingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    guardAccountId: { type: String, required: true },
    guardUserId: { type: String, required: true },
    deviceId: { type: String, required: true },
    gateId: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GuardAccountMappingMaster = mongoose.model<IGuardAccountMappingMaster>(
  "GuardAccountMaster",
  GuardAccountMappingMasterSchema
);

export default GuardAccountMappingMaster;