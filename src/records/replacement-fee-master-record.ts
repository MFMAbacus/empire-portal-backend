import { ObjectId } from "mongoose";

export type ReplacementFeeMasterRecord = {
  _id?: ObjectId;
  id: string;
  feeId: string;
  feeAmount: number;
  tax: string;
  currency: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
