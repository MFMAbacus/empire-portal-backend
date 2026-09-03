import { ObjectId } from "mongoose";

export type ApartmentMasterRecord = {
  _id?: ObjectId;
  id: string;
  apartmentId: string;
  apartmentNo: string;
  buildingOrTower: string;
  floor: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
