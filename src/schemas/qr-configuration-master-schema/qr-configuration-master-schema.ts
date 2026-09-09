import mongoose, { Schema, Document } from "mongoose";

export interface IQRConfigurationMaster extends Document {
  id: string;
  qrConfigId: string;
  expiryHours: number;
  isOneTimeScan: boolean;
  isGateValidation: boolean;
  isPdfRequired: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const QRConfigurationMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    qrConfigId: { type: String, required: true, unique: true },
    expiryHours: { type: Number, required: true },
    isOneTimeScan: { type: Boolean, default: false },
    isGateValidation: { type: Boolean, default: false },
    isPdfRequired: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const QRConfigurationMaster = mongoose.model<IQRConfigurationMaster>(
  "QRConfigurationMaster",
  QRConfigurationMasterSchema
);

export default QRConfigurationMaster;