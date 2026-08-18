import mongoose, { Schema, Document } from "mongoose";
import { ConfigurationType, CommissionType, ServiceType } from "./types";

export interface IGeneralConfigurationRecord extends Document {
  id: string;
  configKey: string;
  configName: string;
  configType: ConfigurationType;

  // Commission fields (used when configType = "commission")
  commissionType?: CommissionType;
  commissionValue?: number;

  // Validation rule fields (used when configType = "validation_rule")
  validationValue?: number;
  serviceType?: ServiceType;

  // Common fields
  isActive: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateGeneralConfigurationInput {
  commissionType?: CommissionType;
  commissionValue?: number;
  validationValue?: number;
  isActive?: boolean;
}

const GeneralConfigurationRecordSchema =
  new Schema<IGeneralConfigurationRecord>(
    {
      id: { type: String, required: true, unique: true },
      configKey: { type: String, required: true, unique: true },
      configName: { type: String, required: true },
      configType: {
        type: String,
        required: true,
        enum: Object.values(ConfigurationType),
      },
      commissionType: {
        type: String,
        enum: Object.values(CommissionType),
        default: null,
      },
      commissionValue: { type: Number, default: null },
      validationValue: { type: Number, default: null },
      serviceType: {
        type: String,
        enum: Object.values(ServiceType),
        default: null,
      },
      isActive: { type: Boolean, required: true },
      description: { type: String, default: null },
    },
    {
      timestamps: true,
    }
  );

export const GeneralConfiguration = mongoose.model<IGeneralConfigurationRecord>(
  "GeneralConfiguration",
  GeneralConfigurationRecordSchema
);
