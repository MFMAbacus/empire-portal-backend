import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCourtBlockingMasterService } from "./create-court-blocking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

export const createCourtBlockingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCourtBlockingMasterService({
    courtBlockingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-court-blocking-master-service";
