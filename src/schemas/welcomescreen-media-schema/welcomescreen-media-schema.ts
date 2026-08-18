import mongoose, { Schema, Document } from "mongoose";

export interface IWelcomescreenMediaRecord extends Document {
  title: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const WelcomescreenMediaSchema = new Schema<IWelcomescreenMediaRecord>({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true, enum: ["image", "gif"] },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  displayOrder: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

WelcomescreenMediaSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const WelcomescreenMedia = mongoose.model<IWelcomescreenMediaRecord>(
  "WelcomescreenMedia",
  WelcomescreenMediaSchema
);
