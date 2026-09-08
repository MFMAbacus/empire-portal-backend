import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteGateMasterService } from "./delete-gate-master-service";
import { getSessionService } from "@/services/get-session-service";
import { gateMasterRepository } from "@/repositories/gate-master-repository";

export const deleteGateMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteGateMasterService({
    gateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-gate-master-service";
