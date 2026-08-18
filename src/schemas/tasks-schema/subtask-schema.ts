import mongoose, { Schema, Document, Model } from "mongoose";

// SubTaskRecord Schema and Interface
export interface ISubTaskRecord extends Document {
  id: string;
  title: string;
  staffId: string | null;
  staffName: string | null;
  isComplete: boolean;
  completedAt: string | null;
}

const SubTaskRecordSchema = new Schema<ISubTaskRecord>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  staffId: { type: String, default: null },
  staffName: { type: String, default: null },
  isComplete: { type: Boolean, required: true },
  completedAt: { type: String, default: null },
});

export const SubTaskRecord: Model<ISubTaskRecord> =
  mongoose.model<ISubTaskRecord>("SubTask", SubTaskRecordSchema);
