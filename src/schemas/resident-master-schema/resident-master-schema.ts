import mongoose, { Schema, Document } from "mongoose";

export interface IResidentMaster extends Document {
  id: string;
  residentId: string;
  name: string;
  email: string;
  mobileNo: number;
  loginUserId?: string;
  residentType: string;
  apartmentId: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const ResidentMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    residentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    loginUserId: { type: String, required: false, default: "" },
    residentType: { type: String, required: true },
    apartmentId: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ResidentMaster = mongoose.model<IResidentMaster>(
  "ResidentMaster",
  ResidentMasterSchema
);

export default ResidentMaster;