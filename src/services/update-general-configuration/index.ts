import { UpdateGeneralConfigurationService } from "./update-general-configuration-service";
import { generalConfigurationRepository } from "@/repositories/general-configuration-repository";

export const updateGeneralConfigurationService = new UpdateGeneralConfigurationService({
  generalConfigurationRepository,
});

export * from "./update-general-configuration-service";