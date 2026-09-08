import { ObjectId } from "mongoose";

export type VehicleTypeMasterRecord = {
  _id?: ObjectId;
  id: string;
  vehicleTypeId: string;
  vehicleType: string;
  isActive: boolean;
  isArchived: boolean;
};