import mongoose, { Schema, Document } from "mongoose";

export interface ICourtMaster extends Document {
  id: string;
  courtId: string;
  courtName: string;
  courtType:string;
  location: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const CourtMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    courtId: { type: String, required: true },
    courtName: { type: String, required: true },
    courtType: { type: String, required: true },
    location: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourtMaster = mongoose.model<ICourtMaster>(
  "CourtMaster",
  CourtMasterSchema
);

export default CourtMaster;
