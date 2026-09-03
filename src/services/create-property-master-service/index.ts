import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreatePropertyMasterService } from "./create-property-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyMasterRepository } from "@/repositories/property-master-repository";

export const createPropertyMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreatePropertyMasterService({
    propertyMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-property-master-service";
