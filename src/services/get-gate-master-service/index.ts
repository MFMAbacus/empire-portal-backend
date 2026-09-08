import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetGateMasterService } from "./get-gate-master-service";
import { getSessionService } from "@/services/get-session-service";
import { gateMasterRepository } from "@/repositories/gate-master-repository";

export const getGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetGateMasterService({
    gateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-gate-master-service";
