import mongoose, { Schema, Document, Types } from "mongoose";

export type RequestUpdateType =
  | "created"
  | "approved"
  | "refused"
  | "activated"
  | "completed"
  | "rated"
  | "items-set"
  | "payment";

export interface IRequestUpdate extends Document {
  id: string;
  userId: string;
  userName: string;
  type: RequestUpdateType;
  date: string;
}

const RequestUpdateSchema = new Schema<IRequestUpdate>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "created",
      "approved",
      "refused",
      "activated",
      "completed",
      "rated",
      "items-set",
      "payment",
    ],
    required: true,
  },
  date: { type: String, required: true },
});

export const RequestUpdate = mongoose.model<IRequestUpdate>(
  "RequestUpdate",
  RequestUpdateSchema
);
