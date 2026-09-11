import { ObjectId } from "mongoose";

export type CardReplacementReasonMasterRecord = {
  _id?: ObjectId;
  id: string;
  reasonId: string;
  reasonName: string;
  chargesApplicable: boolean;
  isActive: boolean;
  isArchived: boolean;
};