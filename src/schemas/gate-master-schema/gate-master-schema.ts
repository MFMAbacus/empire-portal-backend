import mongoose, { Schema, Document } from "mongoose";

export interface IGateMaster extends Document {
  id: string;
  gateId: string;
  gateName: string;
  location:string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const GateMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    gateId: { type: String, required: true },
    gateName: { type: String, required: true },
    location: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GateMaster = mongoose.model<IGateMaster>(
  "GateMaster",
  GateMasterSchema
);

export default GateMaster;
