import mongoose, { Schema, Document } from "mongoose";

export type PaymentMethod =
  | "cash"
  | "credit"
  | "fib"
  | "credit-card"
  | "fast-pay";

export interface IRequestPaymentRecord extends Document {
  id: string;
  method: PaymentMethod;
  amount: number;
  date: string;
}

const RequestPaymentSchema = new Schema<IRequestPaymentRecord>({
  id: { type: String, required: true },
  method: {
    type: String,
    enum: ["cash", "credit", "fib", "credit-card", "fast-pay"],
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

export const RequestPayment = mongoose.model<IRequestPaymentRecord>(
  "RequestPayment",
  RequestPaymentSchema
);
