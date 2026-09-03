import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeletePropertyMasterService } from "./delete-property-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyMasterRepository } from "@/repositories/property-master-repository";

export const deletePropertyMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeletePropertyMasterService({
    propertyMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-property-master-service";
