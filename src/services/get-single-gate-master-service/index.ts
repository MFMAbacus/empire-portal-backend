import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleGateMasterService } from "./get-single-gate-master-service";
import { getSessionService } from "@/services/get-session-service";
import { gateMasterRepository } from "@/repositories/gate-master-repository";

export const getSingleGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleGateMasterService({
    gateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-gate-master-service";
