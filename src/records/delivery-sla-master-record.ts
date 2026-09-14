import { ObjectId } from "mongoose";

export type DeliverySLAMasterRecord = {
  _id?: ObjectId;
  id: string;
  deliveryPeriodHours: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};