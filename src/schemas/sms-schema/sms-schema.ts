import { Schema, Document, model } from "mongoose";

export interface ISmsRecord extends Document {
  phoneNumber: String;
  sms: String;
}

const smsSchema = new Schema({
  phoneNumber: { type: String, required: true },
  sms: { type: String, required: true },
});

export const Sms = model<ISmsRecord>("sms", smsSchema);
