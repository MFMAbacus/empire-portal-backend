import { ObjectId } from "mongoose";

export type CommonStatusMasterRecord = {
  _id?: ObjectId;
  id: string;
  statusCode: string;
  module: string;
  statusName: string;
  sequence:number;
  isActive: boolean;
  isArchived: boolean;
};
