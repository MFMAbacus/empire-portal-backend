import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCourtTimeMasterService } from "./create-court-time-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtTimeMasterRepository } from "@/repositories/court-time-master-repository";

export const createCourtTimeMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCourtTimeMasterService({
    courtTimeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-court-time-master-service";
