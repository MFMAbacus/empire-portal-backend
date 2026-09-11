import mongoose, { Schema, Document } from "mongoose";

export interface ICardReplacementReasonMaster extends Document {
  id: string;
  reasonId: string;
  reasonName: string;
  chargesApplicable: boolean;
  isActive: boolean;
  isArchived: boolean;
}

const CardReplacementReasonMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    reasonId: { type: String, required: true },
    reasonName: { type: String, required: true },
    chargesApplicable: { type: Boolean, required: false},
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CardReplacementReasonMaster = mongoose.model<ICardReplacementReasonMaster>(
  "CardReplacementReasonMaster",
  CardReplacementReasonMasterSchema
);

export default CardReplacementReasonMaster;