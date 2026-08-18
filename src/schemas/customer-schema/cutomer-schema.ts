import mongoose, { Schema, Document, Types } from "mongoose";

export type VehicleReference = Types.ObjectId;

export interface ICustomerRecord extends Document {
  id: string;
  projectId: string | null;
  subProject: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  comments: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactNumber: string | null;
  vehicles: VehicleReference[];
  username: string;
  password: string;
  isInvited: boolean;
  isActive: boolean;
  isBlocked: boolean;
  profilePicture: string | null;
}

const CustomerSchema = new Schema<ICustomerRecord>({
  id: { type: String, required: true },
  projectId: { type: String, default: null },
  subProject: { type: String, default: null },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  address: { type: String },
  comments: { type: String, default: null },
  emergencyContactName: { type: String, default: null },
  emergencyContactRelationship: { type: String, default: null },
  emergencyContactNumber: { type: String, default: null },
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],
  username: { type: String, required: true },
  password: { type: String, required: true },
  isInvited: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
  isBlocked: { type: Boolean, required: true },
  profilePicture: { type: String, default: null },
});

export const Customer = mongoose.model<ICustomerRecord>(
  "Customer",
  CustomerSchema
);
