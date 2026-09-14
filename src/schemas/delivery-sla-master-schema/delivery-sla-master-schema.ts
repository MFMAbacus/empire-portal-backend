import mongoose, { Schema, Document } from "mongoose";

export interface IDeliverySLAMaster extends Document {
  id: string;
  deliveryPeriodHours: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const DeliverySLAMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    deliveryPeriodHours: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DeliverySLAMaster =
  mongoose.models.DeliverySLAMaster ||
  mongoose.model<IDeliverySLAMaster>(
    "DeliverySLAMaster",
    DeliverySLAMasterSchema
  );

export default DeliverySLAMaster;