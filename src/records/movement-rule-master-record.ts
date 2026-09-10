import { ObjectId } from "mongoose";

export type MovementRuleMasterRecord = {
  _id?: ObjectId;
  id?: string;
  ruleId?: string;
  projectCode: string;
  startTime: string;
  endTime: string;
  blockedDays?: string;
  isActive: boolean;
  isArchived: boolean;
};