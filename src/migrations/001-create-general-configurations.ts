import { Migration } from "./migration-runner";
import {
  GeneralConfiguration,
  IGeneralConfigurationRecord,
  ConfigurationType,
  CommissionType,
  ConfigurationKey,
  ServiceType,
} from "@/schemas/general-configuration-schema";
import { Generator } from "@/utility/generator";

export const CreateGeneralConfigurationsMigration: Migration = {
  name: "CreateGeneralConfigurations",
  version: "001",
  description:
    "Create initial general configuration records for FIB, FastPay commissions and electricity validation rules",

  async up(): Promise<void> {
    const existingConfigs = await GeneralConfiguration.find({}).exec();

    if (existingConfigs.length > 0) {
      console.log(
        `   ⏭️  Skipping - ${existingConfigs.length} configurations already exist`
      );
      return;
    }

    const predefinedConfigs: Partial<IGeneralConfigurationRecord>[] = [
      {
        id: Generator.uuid("GC"),
        configKey: ConfigurationKey.FIB_COMMISSION,
        configName: "FIB Bank Charge Rate",
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
        configName: "FastPay Bank Charge Rate",
        configType: ConfigurationType.COMMISSION,
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 1,
        isActive: true,
        description:
          "FastPay payment gateway commission (always rounded up to nearest dinar)",
      },
      {
        id: Generator.uuid("GC"),
        configKey: ConfigurationKey.CREDIT_COMMISSION,
        configName: "Credit Card Bank Charge Rate",
        configType: ConfigurationType.COMMISSION,
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 1,
        isActive: true,
        description:
          "Credit/Master payment commission (always rounded up to nearest dinar)",
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
      {
        id: Generator.uuid("GC"),
        configKey: "FIB_PAYMENT",
        configName: "FIB Payment Enable",
        configType: ConfigurationType.ENABLE_DISABLE,
        isActive: true,
      },
      {
        id: Generator.uuid("GC"),
        configKey: "FAST_PAY_PAYMENT",
        configName: "FIB Payment Enable",
        configType: ConfigurationType.ENABLE_DISABLE,
        isActive: true,
      },
      {
        id: Generator.uuid("GC"),
        configKey: "CREDIT_PAYMENT",
        configName: "FIB Payment Enable",
        configType: ConfigurationType.ENABLE_DISABLE,
        isActive: true,
      },
    ];

    for (const config of predefinedConfigs) {
      await GeneralConfiguration.create(config);
    }

    console.log(
      `   📝 Created ${predefinedConfigs.length} general configuration records`
    );
  },

  async down(): Promise<void> {
    const configKeys = [
      ConfigurationKey.FIB_COMMISSION,
      ConfigurationKey.FASTPAY_COMMISSION,
      ConfigurationKey.MAX_OUTSTANDING_INVOICES_ELECTRICITY,
    ];

    const result = await GeneralConfiguration.deleteMany({
      configKey: { $in: configKeys },
    }).exec();

    console.log(
      `   🗑️  Removed ${result.deletedCount} general configuration records`
    );
  },
};
