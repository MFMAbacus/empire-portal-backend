import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtTimeMasterService } from "./get-court-time-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtTimeMasterRepository } from "@/repositories/court-time-master-repository";
import { GetMobileCourtTimeMasterService } from "./get-mobile-court-time-master-service";

export const getCourtTimeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtTimeMasterService({
    courtTimeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export const getMobileCourtTimeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileCourtTimeMasterService(),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-court-time-master-service";
export * from "./get-mobile-court-time-master-service";