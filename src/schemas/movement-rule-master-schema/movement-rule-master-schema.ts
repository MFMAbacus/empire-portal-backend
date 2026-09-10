import mongoose, { Schema, Document } from "mongoose";

export interface IMovementRuleMaster extends Document {
  id: string;
  ruleId?: string;
  projectCode: string;
  startTime: string;
  endTime: string;
  blockedDays?: string;
  isActive: boolean;
  isArchived: boolean;
}

const MovementRuleMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    ruleId: { type: String, required: false },
    projectCode: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    blockedDays: { type: String, required: false, default: "" },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MovementRuleMaster = mongoose.model<IMovementRuleMaster>(
  "MovementRuleMaster",
  MovementRuleMasterSchema
);

export default MovementRuleMaster;