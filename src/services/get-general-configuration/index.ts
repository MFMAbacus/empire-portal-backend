import { GetGeneralConfigurationService } from "./get-general-configuration-service";
import { generalConfigurationRepository } from "@/repositories/general-configuration-repository";

export const getGeneralConfigurationService = new GetGeneralConfigurationService({
  generalConfigurationRepository,
});

export * from "./get-general-configuration-service";