import mongoose, { Schema, Document } from "mongoose";

export interface IVenueOperatingMaster extends Document {
  id: string;
  venueId: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const VenueOperatingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    venueId: { type: String, required: true },
    day: { type: String, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isClosed: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const VenueOperatingMaster = mongoose.models.VenueOperatingMaster || mongoose.model<IVenueOperatingMaster>(
  "VenueOperatingMaster",
  VenueOperatingMasterSchema
);

export default VenueOperatingMaster;