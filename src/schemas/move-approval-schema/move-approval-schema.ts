import mongoose, { Document, Schema } from "mongoose";

export interface IMoveApproval extends Document {
  id: string;
  requestId: string;
  residentId: string;
  apartmentId: string;
  projectCode: string;
  movementTypeId: string;   // Move-in or Move-out
  itemTypeId: string;        // Item category
  itemImage?: string;        // uploaded image path/URL
  movementDate: string;      // YYYY-MM-DD
  movementTime: string;      // HH:mm
  comments?: string;
  isRuleValid: boolean;
  ruleValidationNotes: string;
  status: string;            // Driven by CommonStatusMaster sequence
  approverId?: string;
  rejectionReason?: string;
  approvalHistory?: any[];
  active: boolean;
}

const MoveApprovalSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    requestId: { type: String, required: true, default: "" },
    residentId: { type: String, required: true, default: "" },
    apartmentId: { type: String, required: true, default: "" },
    projectCode: { type: String, required: false, default: "" },
    movementTypeId: { type: String, required: true, default: "" },
    itemTypeId: { type: String, required: true, default: "" },
    itemImage: { type: String, required: true, default: "" },
    movementDate: { type: String, required: true, default: "" },
    movementTime: { type: String, required: true, default: "" },
    comments: { type: String, required: false, default: "" },
    isRuleValid: { type: Boolean, default: false },
    ruleValidationNotes: { type: String, default: "" },
    status: { type: String, default: "Pending" },
    approverId: { type: String, required: false },
    rejectionReason: { type: String, required: false },
    approvalHistory: { type: Array, default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.MoveApproval ||
  mongoose.model<IMoveApproval>("MoveApproval", MoveApprovalSchema);
