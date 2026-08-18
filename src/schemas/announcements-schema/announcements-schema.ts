// announcement-model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  expirationDate: string | null;
  isPublished: boolean;
  group: "customers" | "staff" | "customers-staff";
  pts: string[];
  pss: string[];
  bps: string[];
  prs: string[];
  bls: string[];
  fls: string[];
  uns: string[];
  attachments: string[];
  isArchived: boolean;
}

const AnnouncementSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  publishDate: { type: String, required: true },
  expirationDate: { type: String },
  isPublished: { type: Boolean, required: true },
  group: {
    type: String,
    enum: ["customers", "staff", "customers-staff"],
    required: true,
  },
  pts: [String],
  pss: [String],
  bps: [String],
  prs: [String],
  bls: [String],
  fls: [String],
  uns: [String],
  attachments: [String],
  isArchived: { type: Boolean, required: true },
});

const Announcement = mongoose.model<IAnnouncement>(
  "Announcement",
  AnnouncementSchema
);

export default Announcement;
