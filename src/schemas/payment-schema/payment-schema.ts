import mongoose, { Schema, Document } from "mongoose";
import { IPaymentItemRecord } from "./payment-item-schema";

export type PaymentMethod =
  | "cash"
  | "credit"
  | "fib"
  | "credit-card"
  | "fast-pay";

export interface IPaymentRecord extends Document {
  uuid?: string;
  id: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  staffId: string | null;
  staffName: string | null;
  totalAmount: number;
  commissionAmount: string;
  submittedAmount: number;
  requestsIds: string[];
  items: IPaymentItemRecord[];
  method: PaymentMethod;
  createdAt: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
  isSubmitted: boolean;
  submittedAt: string | null;
  remarks: string | null;
  sapMessage: string | null;
  docNum: string;
  sapStatus: boolean;
  retryDate: string | null;

  callBackAttempted: Boolean;
  isFailed: Boolean;
}

const PaymentSchema = new Schema<IPaymentRecord>({
  uuid: { type: String },
  id: { type: String, required: true },
  customerId: { type: String, required: true },
  customerCode: { type: String, required: true },
  customerName: { type: String, required: true },
  staffId: { type: String, default: null },
  staffName: { type: String, default: null },
  totalAmount: { type: Number, required: true },
  commissionAmount: { type: String, required: true },
  submittedAmount: { type: Number, required: true },
  requestsIds: { type: [String], required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentItem",
      required: true,
    },
  ],
  method: {
    type: String,
    enum: ["cash", "credit", "fib", "credit-card", "fast-pay"],
    required: true,
  },
  createdAt: { type: String, required: true },
  isConfirmed: { type: Boolean, required: true },
  confirmedAt: { type: String, default: null },
  isSubmitted: { type: Boolean, required: true },
  submittedAt: { type: String, default: null },
  remarks: { type: String, default: null },
  sapMessage: { type: String, default: null },
  docNum: { type: String, default: "" },
  sapStatus: { type: Boolean, default: null },
  retryDate: { type: String, default: null },

  callBackAttempted: { type: Boolean, default: false },
  isFailed: { type: Boolean, default: false },
});

export const Payment = mongoose.model<IPaymentRecord>("Payment", PaymentSchema);
