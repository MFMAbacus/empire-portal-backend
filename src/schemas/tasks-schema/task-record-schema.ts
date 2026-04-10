import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ISubTaskRecord } from "./subtask-schema";
import { ITaskAttendance } from "./task-attendance-schema";
import { ITaskUpdate } from "./task-update-schema";

// TaskRecord Schema and Interface
export interface ITaskRecord extends Document {
  id: string;
  categoryId: string;
  categoryName: string;
  customerId: string | null;
  customerName: string | null;
  projectId: string | null;
  title: string;
  description: string;
  status: string;
  visitDate: string;
  visitTime: string;
  priority: "low" | "medium" | "high" | "urgent";
  staffId: string | null;
  staffName: string | null;
  creationDate: string;
  dueDate: string;
  completedAt: string | null;
  completeRemarks: string | null;
  completeAttachments: string[];
  isClosed: boolean;
  closedAt: string | null;
  subTasks: ISubTaskRecord[];
  attendance: ITaskAttendance[];
  updates: ITaskUpdate[];
  attachments: string[];
  isArchived: boolean;
  bls: string[];
  fls: string[];
}

export type SubTaskRecordReference = Types.ObjectId;

const TaskRecordSchema = new Schema<ITaskRecord>({
  id: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  customerId: { type: String, default: null },
  customerName: { type: String, default: null },
  projectId: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitTime: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  staffId: { type: String, default: null },
  staffName: { type: String, default: null },
  creationDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  completedAt: { type: String, default: null },
  completeRemarks: { type: String, default: null },
  completeAttachments: { type: [String], required: true },
  isClosed: { type: Boolean, required: true },
  closedAt: { type: String, default: null },

  subTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTask",
    },
  ],
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskAttendance",
    },
  ],
  updates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskUpdate",
    },
  ],
  attachments: { type: [String], required: true },
  isArchived: { type: Boolean, required: true },
  bls: { type: [String], required: true },
  fls: { type: [String], required: true },
});

export const Task: Model<ITaskRecord> = mongoose.model<ITaskRecord>(
  "Task",
  TaskRecordSchema
);
