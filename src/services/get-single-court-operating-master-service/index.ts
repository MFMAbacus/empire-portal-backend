import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCourtOperatingMasterService } from "./get-single-court-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

export const getSingleCourtOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCourtOperatingMasterService({
    courtOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-court-operating-master-service";
