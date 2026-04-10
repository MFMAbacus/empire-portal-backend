import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";

import {
  IGeneralConfigurationRecord,
  ConfigurationType,
  CommissionType,
} from "@/schemas/general-configuration-schema";

export class GeneralConfigurationModel extends Model {
  public static make(
    record: Partial<IGeneralConfigurationRecord>
  ): GeneralConfigurationModel {
    const filteredRecord: Partial<IGeneralConfigurationRecord> = {
      _id: record._id,
      id: record.id,
      configKey: record.configKey,
      configName: record.configName,
      configType: record.configType,
      commissionType: record.commissionType,
      commissionValue: record.commissionValue,
      validationValue: record.validationValue,
      serviceType: record.serviceType,
      isActive: record.isActive,
      description: record.description,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    const model = new GeneralConfigurationModel(
      Model._makeAttributes(filteredRecord)
    );
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "configKey",
      Validation.make(this.get("configKey")).mandatory().string().getRule()
    );

    validationBag.set(
      "configName",
      Validation.make(this.get("configName")).mandatory().string().getRule()
    );

    validationBag.set(
      "configType",
      Validation.make(this.get("configType")).mandatory().string().getRule()
    );

    validationBag.set(
      "isActive",
      Validation.make(this.get("isActive")).mandatory().boolean().getRule()
    );

    const configType = this.get<ConfigurationType>("configType");
    if (configType === ConfigurationType.COMMISSION) {
      validationBag.set(
        "commissionType",
        Validation.make(this.get("commissionType"))
          .mandatory()
          .string()
          .getRule()
      );

      validationBag.set(
        "commissionValue",
        Validation.make(this.get("commissionValue"))
          .mandatory()
          .number()
          .getRule()
      );

      const commissionType = this.get<CommissionType>("commissionType");
      const commissionValue = this.get<number>("commissionValue");

      if (
        commissionType === CommissionType.PERCENTAGE &&
        commissionValue &&
        (commissionValue < 0 || commissionValue > 100)
      ) {
        validationBag.set(
          "commissionValue",
          Validation.make(commissionValue).mandatory().number().getRule()
        );
      }

      if (
        commissionType === CommissionType.LUMP_SUM &&
        commissionValue &&
        commissionValue <= 0
      ) {
        validationBag.set(
          "commissionValue",
          Validation.make(commissionValue).mandatory().number().getRule()
        );
      }
    }

    if (configType === ConfigurationType.VALIDATION_RULE) {
      validationBag.set(
        "validationValue",
        Validation.make(this.get("validationValue"))
          .mandatory()
          .number()
          .getRule()
      );
    }

    return validationBag;
  }
}
