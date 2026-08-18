import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVehicleRecord extends Document {
  id: string;
  palletNumber: string;
  type: string;
  color: string;
  model: any;
}

const VehicleSchema = new Schema<IVehicleRecord>({
  id: { type: String, required: true },
  palletNumber: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
});

export const Vehicle = mongoose.model<IVehicleRecord>("Vehicle", VehicleSchema);
