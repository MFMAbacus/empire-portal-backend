import {
  GeneralConfiguration,
  IGeneralConfigurationRecord,
  ConfigurationType,
  CommissionType,
  ConfigurationKey,
  ServiceType,
} from "@/schemas/general-configuration-schema";
import { GeneralConfigurationRepository } from "./general-configuration-repository";
import { MongoRepository } from "@/utility/mongo-repository";
import { Generator } from "@/utility/generator";

export class GeneralConfigurationRepositoryDb
  extends MongoRepository<IGeneralConfigurationRecord>
  implements GeneralConfigurationRepository
{
  public constructor() {
    super(GeneralConfiguration);
  }

  public async getAll(): Promise<IGeneralConfigurationRecord[]> {
    return super.getAll();
  }

  public async get(
    configKey: string
  ): Promise<IGeneralConfigurationRecord | undefined> {
    const result = await GeneralConfiguration.findOne({ configKey }).exec();
    return result || undefined;
  }

  public async exists(configKey: string): Promise<boolean> {
    const count = await GeneralConfiguration.countDocuments({
      configKey,
    }).exec();
    return count > 0;
  }

  public async create(record: IGeneralConfigurationRecord): Promise<IGeneralConfigurationRecord> {
    return await super.create(record);
  }

  public async update(record: Partial<IGeneralConfigurationRecord>): Promise<IGeneralConfigurationRecord | undefined> {
    if (!record.configKey) {
      throw new Error("configKey is required for update operation");
    }

    const result = await GeneralConfiguration.findOneAndUpdate(
      { configKey: record.configKey },
      {
        $set: {
          commissionType: record.commissionType,
          commissionValue: record.commissionValue,
          validationValue: record.validationValue,
          isActive: record.isActive,
          updatedAt: new Date(),
        },
      },
      { new: true }
    ).exec();

    return result || undefined;
  }

  public async initializePredefinedConfigurations(): Promise<void> {
    const configurations = await this.getAll();

    // Only initialize if no configurations exist
    if (configurations.length === 0) {
      const predefinedConfigs: Partial<IGeneralConfigurationRecord>[] = [
        {
          id: Generator.uuid("GC"),
          configKey: ConfigurationKey.FIB_COMMISSION,
          configName: "FIB Commission Rate",
          configType: ConfigurationType.COMMISSION,
          commissionType: CommissionType.PERCENTAGE,
          commissionValue: 1,
          isActive: true,
          description:
            "FIB payment gateway commission (always rounded up to nearest dinar)",
        },
        {
          id: Generator.uuid("GC"),
          configKey: ConfigurationKey.FASTPAY_COMMISSION,
          configName: "FastPay Commission Rate",
          configType: ConfigurationType.COMMISSION,
          commissionType: CommissionType.PERCENTAGE,
          commissionValue: 1,
          isActive: true,
          description:
            "FastPay payment gateway commission (always rounded up to nearest dinar)",
        },
        {
          id: Generator.uuid("GC"),
          configKey: ConfigurationKey.MAX_OUTSTANDING_INVOICES_ELECTRICITY,
          configName: "Max Outstanding Invoices for Electricity",
          configType: ConfigurationType.VALIDATION_RULE,
          validationValue: 2,
          serviceType: ServiceType.ELECTRICITY,
          isActive: true,
          description:
            "Maximum allowed outstanding service invoices before blocking electricity charging",
        },
      ];

      for (const config of predefinedConfigs) {
        await GeneralConfiguration.create(config);
      }

      console.log("Predefined general configurations initialized successfully");
    }
  }
}
