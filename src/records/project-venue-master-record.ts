import { ObjectId } from "mongoose";

export type ProjectVenueMasterRecord = {
  _id?: ObjectId;
  id: string;
  venueId: string;
  projectCode: string;
  isAccess: boolean;
  isActive: boolean;
  isArchived: boolean;
};
