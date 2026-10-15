import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtBlockingMasterService } from "./get-court-blocking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";
import { GetMobileCourtBlockingMasterService } from "./get-mobile-court-blocking-master-service";

export const getCourtBlockingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtBlockingMasterService({
    courtBlockingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export const getMobileCourtBlockingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileCourtBlockingMasterService(),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-court-blocking-master-service";
export * from "./get-mobile-court-blocking-master-service";