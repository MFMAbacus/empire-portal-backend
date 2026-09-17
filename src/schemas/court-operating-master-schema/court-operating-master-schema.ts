import mongoose, { Schema, Document } from "mongoose";

export interface ICourtOperatingMaster extends Document {
  id: string;
  courtId: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const CourtOperatingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    courtId: { type: String, required: true },
    day: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isClosed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourtOperatingMaster = mongoose.models.CourtOperatingMaster || mongoose.model<ICourtOperatingMaster>(
  "CourtOperatingMaster",
  CourtOperatingMasterSchema
);

export default CourtOperatingMaster;