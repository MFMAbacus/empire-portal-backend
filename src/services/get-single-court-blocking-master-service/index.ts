import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCourtBlockingMasterService } from "./get-single-court-blocking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

export const getSingleCourtBlockingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCourtBlockingMasterService({
    courtBlockingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-court-blocking-master-service";
