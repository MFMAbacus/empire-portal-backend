import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurantStaffMaster extends Document {
  id: string;
  approverRole: string;
  projectCode: string;
  role:string;
  venueId:string;
  isActive: boolean;
  isArchived: boolean;
}

const RestaurantStaffMasterSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    approverRole: { type: String, required: true },
    projectCode: { type: String, required: true },
    role: { type: String, required: true },
    venueId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const RestaurantStaffMaster =
  mongoose.models.RestaurantStaffMaster ||
  mongoose.model<IRestaurantStaffMaster>(
    "RestaurantStaffMaster",
    RestaurantStaffMasterSchema
  );

export default RestaurantStaffMaster;