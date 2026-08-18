import mongoose, { Schema, Document, Types } from "mongoose";
import { IMeetingInvitationRecord } from "./meeting-invitation-schema";

export type MeetingImportance = "low" | "medium" | "high" | "urgent";

export interface IMeetingRecord extends Document {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  importance: MeetingImportance;
  agenda: string;
  invitation: IMeetingInvitationRecord[];
  isArchived: boolean;
}

const MeetingSchema = new Schema<IMeetingRecord>({
  id: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  importance: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    required: true,
  },
  agenda: { type: String, required: true },
  invitation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeetingInvitation",
      required: true,
    },
  ],
  isArchived: { type: Boolean, default: false },
});

export const Meeting = mongoose.model<IMeetingRecord>("Meeting", MeetingSchema);
