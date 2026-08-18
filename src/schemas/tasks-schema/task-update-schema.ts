import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITaskUpdate extends Document {
  // _id: string;
  id: string;
  userId: string;
  userName: string;
  type:
    | "created"
    | "activated"
    | "completed"
    | "paused"
    | "resumed"
    | "checked-in"
    | "checked-out"
    | "closed";
  date: string;
}

const TaskUpdateSchema = new Schema<ITaskUpdate>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "created",
      "activated",
      "completed",
      "paused",
      "resumed",
      "checked-in",
      "checked-out",
      "closed",
    ],
    required: true,
  },
  date: { type: String, required: true },
});

export const TaskUpdate: Model<ITaskUpdate> = mongoose.model<ITaskUpdate>(
  "TaskUpdate",
  TaskUpdateSchema,
);
