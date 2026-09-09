import { ObjectId } from "mongoose";

export type QRConfigurationMasterRecord = {
  _id?: ObjectId;
  id: string;
  qrConfigId: string;
  expiryHours: number;
  isOneTimeScan: boolean;
  isGateValidation: boolean;
  isPdfRequired: boolean;
  isActive: boolean;
  isArchived: boolean;
};