import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateGateMasterService } from "./create-gate-master-service";
import { getSessionService } from "@/services/get-session-service";
import { gateMasterRepository } from "@/repositories/gate-master-repository";

export const createGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateGateMasterService({
    gateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-gate-master-service";
