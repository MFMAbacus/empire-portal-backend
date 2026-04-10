import {
  TransactionStatus,
  TransactionType,
} from "@/records/transaction-record";
import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  type: TransactionType;
  subType: string;
  status: TransactionStatus;
  amount: string;
  transactionRefCode?: string;
  sapRefCode?: string;
  message?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    subType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    transactionRefCode: {
      type: String,
    },
    sapRefCode: {
      type: String,
    },
    message: {
      type: String,
    },
    amount: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
