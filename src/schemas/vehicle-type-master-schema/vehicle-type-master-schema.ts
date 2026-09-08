import mongoose, { Schema, Document } from "mongoose";

export interface IVehicleTypeMaster extends Document {
  id: string;
  vehicleTypeId: string;
  vehicleType: string;
  isActive: boolean;
  isArchived: boolean;
}

const VehicleTypeMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    vehicleTypeId: { type: String, required: true, unique: true },
    vehicleType: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const VehicleTypeMaster = mongoose.model<IVehicleTypeMaster>(
  "VehicleTypeMaster",
  VehicleTypeMasterSchema
);

export default VehicleTypeMaster;