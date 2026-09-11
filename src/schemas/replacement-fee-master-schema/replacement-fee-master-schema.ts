import mongoose, { Schema, Document } from "mongoose";

export interface IReplacementFeeMaster extends Document {
  id: string;
  feeId: string;
  feeAmount: number;
  currency:string;
  tax: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
}

const ReplacementFeeMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    feeId: { type: String, required: true },
    feeAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    tax: { type: String, required: true },
    projectCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ReplacementFeeMaster = mongoose.model<IReplacementFeeMaster>(
  "ReplacementFeeMaster",
  ReplacementFeeMasterSchema
);

export default ReplacementFeeMaster;
