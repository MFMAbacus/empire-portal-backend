import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCourtBlockingMasterService } from "./update-court-blocking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

export const updateCourtBlockingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCourtBlockingMasterService({
    courtBlockingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-court-blocking-master-service";
