import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdatePropertyMasterService } from "./update-property-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyMasterRepository } from "@/repositories/property-master-repository";

export const updatePropertyMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdatePropertyMasterService({
    propertyMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-property-master-service";
