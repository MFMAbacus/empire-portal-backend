import mongoose, { Schema, Document, Types } from "mongoose";

type MeetingInvitationStatus = "pending" | "accepted" | "refused";

export interface IMeetingInvitationRecord extends Document {
  staffId: string;
  staffName: string;
  status: MeetingInvitationStatus;
  isRequired: boolean;
  date: string | null;
  time: string | null;
}

const MeetingInvitationSchema = new Schema<IMeetingInvitationRecord>({
  staffId: { type: String, required: true },
  staffName: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "refused"],
    required: true,
  },
  isRequired: { type: Boolean, required: true },
  date: { type: String, default: null },
  time: { type: String, default: null },
});

export const MeetingInvitation = mongoose.model<IMeetingInvitationRecord>(
  "MeetingInvitation",
  MeetingInvitationSchema
);
