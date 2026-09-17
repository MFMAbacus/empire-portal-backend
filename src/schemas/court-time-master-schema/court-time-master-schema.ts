import mongoose, { Schema, Document } from "mongoose";

export interface ICourtTimeMaster extends Document {
  id: string;
  courtId: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
  isArchived: boolean;
}

const CourtTimeMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    courtId: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, reduired: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourtTimeMaster = mongoose.models.CourtTimeMaster || mongoose.model<ICourtTimeMaster>(
  "CourtTimeMaster",
  CourtTimeMasterSchema
);

export default CourtTimeMaster;