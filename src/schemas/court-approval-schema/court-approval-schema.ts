import mongoose, { Schema, Document } from "mongoose";

export interface ICourtApproval extends Document {
  id: string;
  reservationNo: string;
  requestNo: string;
  courtId: string;
  courtName?: string;
  courtType?: string;
  projectCode: string;
  residentId: string;
  residentName?: string;
  residentEmail?: string;
  residentMobile?: string;
  apartmentNo?: string;
  reservationName?: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  timeSlot: string;
  duration?: string;
  notes?: string;
  status: string; // Pending Blocked, Approved, Rejected, Maintenance Blocked, PT Session Blocked
  approverId?: string;
  rejectionReason?: string;
  hasViolation?: boolean;
  violationDetails?: string;
  approvalHistory?: Array<{
    action: string;
    approverId?: string;
    timestamp: string;
    remarks?: string;
  }>;
  active: boolean;
  isArchived: boolean;
}

const CourtApprovalSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    reservationNo: { type: String, required: true, unique: true },
    requestNo: { type: String, required: true },
    courtId: { type: String, required: true },
    courtName: { type: String, required: false },
    courtType: { type: String, required: false },
    projectCode: { type: String, required: true },
    residentId: { type: String, required: true },
    residentName: { type: String, required: false },
    residentEmail: { type: String, required: false },
    residentMobile: { type: String, required: false },
    apartmentNo: { type: String, required: false },
    reservationName: { type: String, required: false },
    bookingDate: { type: String, required: true },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    timeSlot: { type: String, required: true },
    duration: { type: String, required: false, default: "1 hour" },
    notes: { type: String, required: false },
    status: { type: String, required: true, default: "Pending Blocked" },
    approverId: { type: String, required: false },
    rejectionReason: { type: String, required: false },
    hasViolation: { type: Boolean, default: false },
    violationDetails: { type: String, required: false },
    approvalHistory: [
      {
        action: { type: String },
        approverId: { type: String },
        timestamp: { type: String },
        remarks: { type: String },
      },
    ],
    active: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourtApproval =
  mongoose.models.CourtApproval ||
  mongoose.model<ICourtApproval>("CourtApproval", CourtApprovalSchema);

export default CourtApproval;
