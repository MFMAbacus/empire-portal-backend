import { ObjectId } from "mongoose";

export type RestaurantStaffMasterRecord = {
  _id?: ObjectId;
  id: string;
  approverRole: string;
  role:string;
  venueId: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};