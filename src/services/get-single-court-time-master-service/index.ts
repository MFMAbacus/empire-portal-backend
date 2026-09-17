import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCourtTimeMasterService } from "./get-single-court-time-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtTimeMasterRepository } from "@/repositories/court-time-master-repository";

export const getSingleCourtTimeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCourtTimeMasterService({
    courtTimeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-court-time-master-service";
