import { ObjectId } from "mongoose";

export type AccessCardMasterRecord = {
  _id?: ObjectId;
  id: string;
  cardId: string;
  serialNo: string;
  maskedSerial: string;
  issueDate: string;
  cardStatus: string;
  projectCode: string;
  apartmentId: string;
  residentId: string;
  isActive: boolean;
  isArchived: boolean;
};