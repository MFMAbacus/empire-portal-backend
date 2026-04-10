import mongoose, { Schema, Document, Model } from "mongoose";

// TaskAttendance Schema and Interface
export interface ITaskAttendance extends Document {
  staffId: string;
  staffName: string;
  status: "check-in" | "check-out";
  date: string;
}

const TaskAttendanceSchema = new Schema<ITaskAttendance>({
  staffId: { type: String, required: true },
  staffName: { type: String, required: true },
  status: { type: String, enum: ["check-in", "check-out"], required: true },
  date: { type: String, required: true },
});

export const TaskAttendance: Model<ITaskAttendance> =
  mongoose.model<ITaskAttendance>("TaskAttendance", TaskAttendanceSchema);
