import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetPropertyMasterService } from "./get-property-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyMasterRepository } from "@/repositories/property-master-repository";

export const getPropertyMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetPropertyMasterService({
    propertyMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-property-master-service";
