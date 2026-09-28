import mongoose, { Schema, Document } from "mongoose";

export interface IQRScanLogMaster extends Document {
  id: string;
  guestAccessId: string;
  requestNo: string;
  qrCode: string;
  gateId?: string;
  gateName?: string;
  scannedAt: Date;
  attemptNumber: number;
  status: "Verified" | "Failed";
  reason?: string;
}

const QRScanLogMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    guestAccessId: { type: String, required: true },
    requestNo: { type: String, required: true },
    qrCode: { type: String, required: true },
    gateId: { type: String, required: false },
    gateName: { type: String, required: false },
    scannedAt: { type: Date, default: Date.now },
    attemptNumber: { type: Number, required: true, default: 1 },
    status: { type: String, required: true },
    reason: { type: String, required: false },
  },
  { timestamps: true }
);

const QRScanLogMaster = mongoose.models.QRScanLogMaster || mongoose.model<IQRScanLogMaster>(
  "QRScanLogMaster",
  QRScanLogMasterSchema
);

export default QRScanLogMaster;
