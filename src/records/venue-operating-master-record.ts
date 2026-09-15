import { ObjectId } from "mongoose";

export type VenueOperatingMasterRecord = {
  _id?: ObjectId;
  id: string;
  venueId: string;
  day: string;
  openTime: string;
  closeTime : string;
  isClosed: boolean;
  isActive: boolean;
  isArchived: boolean;
};
