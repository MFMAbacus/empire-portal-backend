import mongoose, { Schema, Document } from "mongoose";

export interface IUserMaster extends Document {
  id: string;
  userId: string;
  name: string;
  role: string;
  assignedModule?: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const UserMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    assignedModule: { type: String, required: false, default: "" },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserMaster = mongoose.model<IUserMaster>(
  "UserMaster",
  UserMasterSchema
);

export default UserMaster;