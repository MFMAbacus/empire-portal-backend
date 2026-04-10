import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRequestItemRecord extends Document {
  // _id: string;
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

const RequestItemSchema = new Schema<IRequestItemRecord>({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export const RequestItem = mongoose.model<IRequestItemRecord>(
  "RequestItem",
  RequestItemSchema,
);
