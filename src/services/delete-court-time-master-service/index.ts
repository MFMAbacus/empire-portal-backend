import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCourtTimeMasterService } from "./delete-court-time-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtTimeMasterRepository } from "@/repositories/court-time-master-repository";

export const deleteCourtTimeMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCourtTimeMasterService({
    courtTimeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-court-time-master-service";
