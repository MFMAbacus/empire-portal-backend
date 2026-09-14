import { ObjectId } from "mongoose";

export type VenueMasterRecord = {
  _id?: ObjectId;
  id: string;
  venueId: string;
  venueName: string;
  type: string;
  projectCode: string;
  location: string;
  contact: string;
  description?: string;
  imageOrLogo?: string;
  isActive: boolean;
  isArchived: boolean;
};