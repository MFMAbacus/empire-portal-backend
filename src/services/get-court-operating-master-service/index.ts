import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtOperatingMasterService } from "./get-court-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

export const getCourtOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtOperatingMasterService({
    courtOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-court-operating-master-service";
