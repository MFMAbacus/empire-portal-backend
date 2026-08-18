import mongoose, { Schema, Document } from "mongoose";
import { IInvoicePaymentItemRecord } from "./invoice-payment-item";

export interface IInvoicePaymentRecord extends Document {
  uuid: string;
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  commissionAmount: string;
  items: IInvoicePaymentItemRecord[];
  sapInvoiceIds: string[];
  method: "fib" | "credit-card" | "fast-pay";
  createdAt: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
  remarks: string | null;
  sapMessage: string | null;
  docNum: string;
  sapStatus: boolean;
  retryDate: string | null;

  callBackAttempted: Boolean;
  isFailed: Boolean;
  deviceType?: string;
}

const InvoicePaymentSchema: Schema<IInvoicePaymentRecord> = new Schema({
  uuid: { type: String },
  id: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  commissionAmount: { type: String, required: true },
  items: [
    {
      type: mongoose.Types.ObjectId,
      ref: "InvoicePaymentItem",
      required: true,
    },
  ],
  sapInvoiceIds: {
    type: [String],
    required: true,
  },
  method: {
    type: String,
    enum: ["fib", "credit-card", "fast-pay"],
    required: true,
  },
  createdAt: { type: String, required: true },
  isConfirmed: { type: Boolean, required: true },
  confirmedAt: { type: String, default: null },
  remarks: { type: String, default: null },
  sapMessage: { type: String, default: null },
  docNum: { type: String, default: "" },
  sapStatus: { type: Boolean, default: null },
  retryDate: { type: String, default: null },

  callBackAttempted: { type: Boolean, default: false },
  isFailed: { type: Boolean, default: false },
  deviceType: { type: String, default: "IOS" },
});

export const InvoicePayment = mongoose.model<IInvoicePaymentRecord>(
  "InvoicePayment",
  InvoicePaymentSchema,
);
