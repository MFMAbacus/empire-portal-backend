import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCourtTimeMasterService } from "./update-court-time-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtTimeMasterRepository } from "@/repositories/court-time-master-repository";

export const updateCourtTimeMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCourtTimeMasterService({
    courtTimeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-court-time-master-service";
