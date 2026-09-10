import { ObjectId } from "mongoose";

export type ItemTypeMasterRecord = {
  _id?: ObjectId;
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  description: string;
  isActive: boolean;
  isArchived: boolean;
};