import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtMasterService } from "./get-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtMasterRepository } from "@/repositories/court-master-repository";
import { GetMobileCourtMasterService } from "./get-mobile-court-master-service";

export const getCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtMasterService({
    courtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileCourtMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-court-master-service";
export * from "./get-mobile-court-master-service";