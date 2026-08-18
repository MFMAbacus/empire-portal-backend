import { GeneralConfigurationRepository } from "./general-configuration-repository";
import { GeneralConfigurationRepositoryDb } from "./general-configuration-repository-db";

export const generalConfigurationRepository: GeneralConfigurationRepository =
  new GeneralConfigurationRepositoryDb();

export * from "./general-configuration-repository";
export * from "./general-configuration-repository-db";
