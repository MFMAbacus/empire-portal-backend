import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCourtOperatingMasterService } from "./update-court-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

export const updateCourtOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCourtOperatingMasterService({
    courtOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-court-operating-master-service";
