import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCourtOperatingMasterService } from "./delete-court-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

export const deleteCourtOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCourtOperatingMasterService({
    courtOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-court-operating-master-service";
