import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCourtMasterService } from "./update-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtMasterRepository } from "@/repositories/court-master-repository";

export const updateCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCourtMasterService({
    courtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-court-master-service";
