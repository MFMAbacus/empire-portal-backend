import mongoose, { Schema, Document } from "mongoose";

export interface IAccessCardMaster extends Document {
  id: string;
  cardId: string;
  serialNo: string;
  maskedSerial: string;
  issueDate: string;
  cardStatus: string;
  projectCode: string;
  apartmentId: string;
  residentId: string;
  isActive: boolean;
  isArchived: boolean;
}

const AccessCardMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    cardId: { type: String, required: true },
    serialNo: { type: String, required: true },
    maskedSerial: { type: String, required: true },
    issueDate: { type: String, required: true },
    cardStatus: { type: String, required: true, default: "Active" },
    projectCode: { type: String, required: true },
    apartmentId: { type: String, required: true },
    residentId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AccessCardMaster = mongoose.model<IAccessCardMaster>(
  "AccessCardMaster",
  AccessCardMasterSchema
);

export default AccessCardMaster;