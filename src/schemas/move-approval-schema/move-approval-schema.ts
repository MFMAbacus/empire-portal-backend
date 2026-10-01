import mongoose, { Document, Schema } from "mongoose";

export interface IMoveApproval extends Document {
  id: string;
  requestNo: string;
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
    requestNo: { type: String, required: true, unique: true },
    residentId: { type: String, required: true },
    apartmentId: { type: String, required: true },
    projectCode: { type: String, required: true },
    movementTypeId: { type: String, required: true },
    itemTypeId: { type: String, required: true },
    itemImage: { type: String, required: false },
    movementDate: { type: String, required: true },
    movementTime: { type: String, required: true },
    comments: { type: String, required: false },
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
