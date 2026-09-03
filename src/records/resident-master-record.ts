import { ObjectId } from "mongoose";

export type ResidentMasterRecord = {
  _id?: ObjectId;
  id: string;
  residentId: string;
  name: string;
  email: string;
  mobileNo: number;
  loginUserId: string;
  residentType: string;
  apartmentId: string;
  projectCode: string;
  isActive: boolean;
  isArchived: boolean;
};
