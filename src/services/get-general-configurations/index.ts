import { AccessMediatorService } from "../access-mediator-service";
import { getSessionService } from "../get-session-service";
import { GetGeneralConfigurationsService } from "./get-general-configurations-service";
import { generalConfigurationRepository } from "@/repositories/general-configuration-repository";

export const getGeneralConfigurationsService = new AccessMediatorService({
  getSessionService,
  service: new GetGeneralConfigurationsService({
    generalConfigurationRepository,
  }),
  roles: ["manager", "customer", "staff"],
});

export * from "./get-general-configurations-service";
