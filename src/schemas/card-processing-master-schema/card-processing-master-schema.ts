import mongoose, { Document, Schema } from "mongoose";

export interface ICardProcessingMaster extends Document {
  id: string;
  requestNo: string;
  residentId: string;
  residentName: string;
  apartmentId: string;
  apartmentNo: string;
  projectCode: string;
  cardId: string;
  fullSerialNo: string;
  maskedSerialNo: string;
  reasonId: string;
  reason: string;
  feeAmount: number;
  currency: string;
  taxAmount: string;
  totalFee: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Failed" | string;
  isSuspended: boolean;
  replacementStatus: "Pending" | "In Process" | "Ready" | "Delivered" | "Rejected" | string;
  status: string;
  deliverySLAHours: string;
  assignedStaffRole?: string;
  approverId?: string;
  rejectionReason?: string;
  approvalHistory?: any[];
  active: boolean;
  isArchived: boolean;
}

const CardProcessingMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    requestNo: { type: String, required: true, unique: true },
    residentId: { type: String, required: true },
    residentName: { type: String, required: true },
    apartmentId: { type: String, required: true },
    apartmentNo: { type: String, required: true },
    projectCode: { type: String, required: true },
    cardId: { type: String, required: true },
    fullSerialNo: { type: String, required: true },
    maskedSerialNo: { type: String, required: true },
    reasonId: { type: String, required: true },
    reason: { type: String, required: true },
    feeAmount: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    taxAmount: { type: String, required: false, default: "0%" },
    totalFee: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, required: true, default: "Credit Card" },
    paymentStatus: { type: String, required: true, default: "Paid" },
    isSuspended: { type: Boolean, default: true },
    replacementStatus: { type: String, required: true, default: "Pending" },
    status: { type: String, required: true, default: "Pending" },
    deliverySLAHours: { type: String, required: false, default: "24" },
    assignedStaffRole: { type: String, required: false },
    approverId: { type: String, required: false },
    rejectionReason: { type: String, required: false },
    approvalHistory: { type: Array, default: [] },
    active: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CardProcessingMaster =
  mongoose.models.CardProcessingMaster ||
  mongoose.model<ICardProcessingMaster>(
    "CardProcessingMaster",
    CardProcessingMasterSchema
  );

export default CardProcessingMaster;
