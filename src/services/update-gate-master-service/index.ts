import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateGateMasterService } from "./update-gate-master-service";
import { getSessionService } from "@/services/get-session-service";
import { gateMasterRepository } from "@/repositories/gate-master-repository";

export const updateGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateGateMasterService({
    gateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-gate-master-service";
