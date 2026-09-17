import mongoose, { Schema, Document } from "mongoose";

export interface ICourtBookingMaster extends Document {
  id: string;
  maxBooking: number;
  advanceBooking: number;
  projectCode: string;
  pendingSlot: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const CourtBookingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    maxBooking: { type: Number, required: true },
    advanceBooking: { type: Number, required: true },
    projectCode: { type: String, required: true },
    pendingSlot: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourtBookingMaster = mongoose.model<ICourtBookingMaster>(
  "CourtBookingMaster",
  CourtBookingMasterSchema
);

export default CourtBookingMaster;