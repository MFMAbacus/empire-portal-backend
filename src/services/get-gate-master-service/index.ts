import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetGateMasterService } from "./get-gate-master-service";
import { getSessionService } from "@/services/get-session-service";
import { gateMasterRepository } from "@/repositories/gate-master-repository";
import { GetMobileGateMasterService } from "./get-mobile-gate-master-service";

export const getGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetGateMasterService({
    gateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export const getMobileGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileGateMasterService(),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-gate-master-service";
export * from "./get-mobile-gate-master-service";