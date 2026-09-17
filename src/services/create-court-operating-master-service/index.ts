import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCourtOperatingMasterService } from "./create-court-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

export const createCourtOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCourtOperatingMasterService({
    courtOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-court-operating-master-service";
