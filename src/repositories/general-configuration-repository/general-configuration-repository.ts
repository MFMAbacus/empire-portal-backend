import { IGeneralConfigurationRecord } from "@/schemas/general-configuration-schema";

export abstract class GeneralConfigurationRepository {
  public abstract getAll(): Promise<IGeneralConfigurationRecord[]>;
  public abstract get(
    configKey: string
  ): Promise<IGeneralConfigurationRecord | undefined>;
  public abstract exists(configKey: string): Promise<boolean>;
  public abstract create(record: IGeneralConfigurationRecord): Promise<IGeneralConfigurationRecord>;
  public abstract update(record: Partial<IGeneralConfigurationRecord>): Promise<IGeneralConfigurationRecord | undefined>;
  public abstract initializePredefinedConfigurations(): Promise<void>;
}
