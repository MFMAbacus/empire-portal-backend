import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurantReservationApproval extends Document {
  id: string;
  reservationNo: string;
  requestNo: string;
  venueId: string;
  venueName?: string;
  projectCode: string;
  residentId: string;
  residentName?: string;
  residentEmail?: string;
  residentMobile?: string;
  reservationName?: string;
  numberOfGuests: number;
  reservationDate: string;
  reservationTime: string;
  notes?: string;
  status: string; // Pending, Approved, Arrived, Expired, Rejected
  approverId?: string;
  rejectionReason?: string;
  arrivalConfirmedAt?: Date;
  isRuleValid?: boolean;
  ruleValidationNotes?: string;
  approvalHistory?: Array<{
    action: string;
    approverId?: string;
    timestamp: string;
    remarks?: string;
  }>;
  active: boolean;
  isArchived: boolean;
}

const RestaurantReservationApprovalSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    reservationNo: { type: String, required: true, unique: true },
    requestNo: { type: String, required: true },
    venueId: { type: String, required: true },
    venueName: { type: String, required: false },
    projectCode: { type: String, required: true },
    residentId: { type: String, required: true },
    residentName: { type: String, required: false },
    residentEmail: { type: String, required: false },
    residentMobile: { type: String, required: false },
    reservationName: { type: String, required: false },
    numberOfGuests: { type: Number, required: true, default: 1 },
    reservationDate: { type: String, required: true },
    reservationTime: { type: String, required: true },
    notes: { type: String, required: false },
    status: { type: String, required: true, default: "Pending" },
    approverId: { type: String, required: false },
    rejectionReason: { type: String, required: false },
    arrivalConfirmedAt: { type: Date, required: false },
    isRuleValid: { type: Boolean, default: true },
    ruleValidationNotes: { type: String, required: false },
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

const RestaurantReservationApproval =
  mongoose.models.RestaurantReservationApproval ||
  mongoose.model<IRestaurantReservationApproval>(
    "RestaurantReservationApproval",
    RestaurantReservationApprovalSchema
  );

export default RestaurantReservationApproval;
