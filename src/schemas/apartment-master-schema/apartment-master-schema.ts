import mongoose, { Schema, Document } from "mongoose";

export interface IApartmentMaster extends Document {
  id: string;
  apartmentId: string;
  apartmentNo: string;
  buildingOrTower:string;
  floor: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const ApartmentMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    apartmentId: { type: String, required: true },
    apartmentNo: { type: String, required: true },
    buildingOrTower: { type: String, required: true },
    floor: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ApartmentMaster = mongoose.model<IApartmentMaster>(
  "ApartmentMaster",
  ApartmentMasterSchema
);

export default ApartmentMaster;
