import { Schema, Document, model } from "mongoose";

export interface IOtpRecord extends Document {
  id: string;
  customerId: string;
  password: string;
  token: string;
}

const otpSchema = new Schema({
  id: { type: String, required: true },
  customerId: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});

export const Otp = model<IOtpRecord>("otp", otpSchema);
