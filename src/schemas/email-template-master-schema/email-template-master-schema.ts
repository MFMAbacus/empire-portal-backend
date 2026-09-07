import mongoose, { Schema, Document } from "mongoose";

export interface IEmailTemplateMaster extends Document {
  id: string;
  templateCode: string;
  module: string;
  event: string;
  subject: string;
  body: string;
  isActive: boolean;
  isArchived: boolean;
}

const EmailTemplateMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    templateCode: { type: String, required: true },
    module: { type: String, required: true },
    event: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const EmailTemplateMaster = mongoose.model<IEmailTemplateMaster>(
  "EmailTemplateMaster",
  EmailTemplateMasterSchema 
);

export default EmailTemplateMaster;
