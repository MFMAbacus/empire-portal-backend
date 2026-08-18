import { Schema, Document, model } from "mongoose";
import { UserPermissions } from "./types";

export interface ISessionRecord extends Document {
  id: string;
  userId: string;
  role: "manager" | "staff" | "customer";
  firstName: string;
  lastName: string;
  departmentId?: string | null;
  permissions: UserPermissions;
}

const SessionSchema = new Schema<ISessionRecord>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  role: {
    type: String,
    enum: ["manager", "staff", "customer"],
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  departmentId: { type: String, default: null },
  permissions: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export const Session = model<ISessionRecord>("Session", SessionSchema);
