import mongoose, { Schema, Document } from "mongoose";

export interface ICourtBlockingMaster extends Document {
  id: string;
  blockId: string;
  blockDate: string;
  startTime:string;
  endTime: string;
  courtId: string;
  reason: string;
  createdBy: string;
  isActive: boolean;
  isArchived: boolean;
}

const CourtBlockingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    blockId: { type: String, required: true },
    blockDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    courtId: { type: String, required: true },
    reason: { type: String, required: true },
    createdBy: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourtBlockingMaster = mongoose.model<ICourtBlockingMaster>(
  "CourtBlockingMaster",
  CourtBlockingMasterSchema
);

export default CourtBlockingMaster;
