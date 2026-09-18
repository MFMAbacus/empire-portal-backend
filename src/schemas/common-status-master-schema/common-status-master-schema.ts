import mongoose, { Schema, Document } from "mongoose";

export interface ICommonStatusMaster extends Document {
  id: string;
  statusCode: string;
  module: string;
  statusName: string;
  sequence: number;
  isActive: boolean;
  isArchived: boolean;
}

const CommonStatusMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    statusCode: { type: String, required: true },
    module: { type: String, required: true },
    statusName: { type: String, required: true },
    sequence: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CommonStatusMaster = mongoose.model<ICommonStatusMaster>(
  "CommonStatusMaster",
  CommonStatusMasterSchema 
);

export default CommonStatusMaster;
