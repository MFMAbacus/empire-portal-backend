import mongoose, { Schema, Document } from "mongoose";

export interface IReservationRuleMaster extends Document {
  id: string;
  slotDuration: number;
  maxGuest: number;
  lateArrival:number;
  venueId: string;
  isActive: boolean;
  isArchived: boolean;
}

const ReservationRuleMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    slotDuration: { type: Number, required: true },
    maxGuest: { type: Number, required: false },
    lateArrival: { type: Number, required: true },
    venueId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ReservationRuleMaster = mongoose.model<IReservationRuleMaster>(
  "ReservationRuleMaster",
  ReservationRuleMasterSchema
);

export default ReservationRuleMaster;
