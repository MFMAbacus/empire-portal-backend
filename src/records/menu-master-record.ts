import { ObjectId } from "mongoose";

export type MenuMasterRecord = {
  _id?: ObjectId;
  id: string;
  menuId: string;
  menuName: string;
  price: number;
  menuItem: string;
  venuId: string;
  isActive: boolean;
  isArchived: boolean;
};
