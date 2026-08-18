import mongoose, { Schema, Document } from "mongoose";

export interface IInvoicePaymentItemRecord extends Document {
  id: string;
  type: string;
  sapInvoiceId: string;
  cardCode: string;
  amount: number;
  date: string;
}

const InvoicePaymentItemSchema: Schema<IInvoicePaymentItemRecord> = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  sapInvoiceId: { type: String, required: true },
  cardCode: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

export const InvoicePaymentItem = mongoose.model<IInvoicePaymentItemRecord>(
  "InvoicePaymentItem",
  InvoicePaymentItemSchema
);
