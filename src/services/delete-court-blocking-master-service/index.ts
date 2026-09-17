import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCourtBlockingMasterService } from "./delete-court-blocking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

export const deleteCourtBlockingMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCourtBlockingMasterService({
    courtBlockingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-court-blocking-master-service";
