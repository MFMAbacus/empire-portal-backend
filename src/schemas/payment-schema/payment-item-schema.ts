import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentItemRecord extends Document {
  row: number;
  requestId: string;
  staffId: string | null;
  totalAmount: number;
  categoryName: string;
}

const PaymentItemSchema = new Schema<IPaymentItemRecord>({
  row: { type: Number, required: true },
  requestId: { type: String, required: true },
  staffId: { type: String, default: null },
  totalAmount: { type: Number, required: true },
  categoryName: { type: String, required: true },
});

export const PaymentItem = mongoose.model<IPaymentItemRecord>(
  "PaymentItem",
  PaymentItemSchema
);
