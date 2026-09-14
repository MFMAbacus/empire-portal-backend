import mongoose, { Schema, Document } from "mongoose";

export interface IVenueMaster extends Document {
  id: string;
  venueId: string;
  venueName: string;
  type: string;
  projectCode: string;
  location: string;
  contact: string;
  description?: string;
  imageOrLogo?: string;
  isActive: boolean;
  isArchived: boolean;
}

const VenueMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    venueId: { type: String, required: true },
    venueName: { type: String, required: true },
    type: { type: String, required: true },
    projectCode: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    description: { type: String, required: false },
    imageOrLogo: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const VenueMaster = mongoose.models.VenueMaster || mongoose.model<IVenueMaster>(
  "VenueMaster",
  VenueMasterSchema
);

export default VenueMaster;