import { ObjectId } from "mongoose";

export type MovementTypeMasterRecord = {
  _id?: ObjectId;
  id: string;
  movementTypeId: string;
  type: string;
  isActive: boolean;
  isArchived: boolean;
};