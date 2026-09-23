import mongoose, { Document, Schema } from "mongoose";

export interface IGuestAccess extends Document {
  id: string;
  requestNo: string;
  residentId: string;
  apartmentId: string;
  projectCode: string;
  vehiclePlateNo?: string;
  vehicleType?: string;
  visitDate?: Date;
  startTime?: string;
  duration?: string;
  comments?: string;
  status: string;
  approvalStatus: string;
  approverId?: string;
  rejectionReason?: string;
  assignedGateId?: string;
  qrCode?: string;
  qrStatus?: string;
  checkInDateTime?: Date;
  active: boolean;
}

const GuestAccessSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    requestNo: { type: String, required: true },
    residentId: { type: String, required: true },
    apartmentId: { type: String, required: true },
    projectCode: { type: String, required: true },
    vehiclePlateNo: { type: String, required: false },
    vehicleType: { type: String, required: false },
    visitDate: { type: Date, required: false },
    startTime: { type: String, required: false },
    duration: { type: String, required: false },
    comments: { type: String, required: false },
    status: { type: String, default: "Pending" },
    approvalStatus: { type: String, default: "Pending" },
    approverId: { type: String, required: false },
    rejectionReason: { type: String, required: false },
    assignedGateId: { type: String, required: false },
    qrCode: { type: String, required: false },
    qrStatus: { type: String, required: false },
    checkInDateTime: { type: Date, required: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.GuestAccess ||
  mongoose.model<IGuestAccess>("GuestAccess", GuestAccessSchema);
