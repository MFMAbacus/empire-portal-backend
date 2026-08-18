import mongoose, { Schema, Document } from "mongoose";
import { UserPermissions } from "../session-schema/types";
import { BuyServiceCategoryNames } from "@/records/user-record";

export interface IUserRecord extends Document {
  id: string;
  salespersonId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  departmentId: string | null;
  employeeId: string | null;
  jobTitle: string | null;
  password: string;
  isMobileUser: boolean;
  isCachier: boolean;
  serviceType: BuyServiceCategoryNames[] | null;
  project: string[] | null;
  permissions: UserPermissions;
  profilePicture: string | null;
  isArchived: boolean;
}

const UserRecordSchema = new Schema<IUserRecord>({
  id: { type: String, required: true, unique: true },
  salespersonId: { type: String, default: null },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, default: null },
  departmentId: { type: String, default: null },
  employeeId: { type: String, default: null },
  jobTitle: { type: String, default: null },
  password: { type: String, required: true },
  isMobileUser: { type: Boolean, required: true },
  isCachier: { type: Boolean, required: true },
  serviceType: {
    type: [String],
    enum: Object.values(BuyServiceCategoryNames),
    required: false,
    default: null,
  },
  project: {
    type: [String],
    required: false,
    default: null,
  },
  permissions: {
    type: Schema.Types.Mixed,
    default: {},
  },
  profilePicture: { type: String, default: null },
  isArchived: { type: Boolean, required: true },
});

export const User = mongoose.model<IUserRecord>("User", UserRecordSchema);
