import {
  ConfigurationType,
  CommissionType,
  ServiceType,
} from "@/schemas/general-configuration-schema";

export type GeneralConfigurationRecord = {
  _id: string;
  id: string;
  configKey: string;
  configName: string;
  configType: ConfigurationType;

  commissionType?: CommissionType;
  commissionValue?: number;

  validationValue?: number;
  serviceType?: ServiceType;

  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
