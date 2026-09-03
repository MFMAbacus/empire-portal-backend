import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSinglePropertyMasterService } from "./get-single-property-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyMasterRepository } from "@/repositories/property-master-repository";

export const getSinglePropertyMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSinglePropertyMasterService({
    propertyMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-property-master-service";
