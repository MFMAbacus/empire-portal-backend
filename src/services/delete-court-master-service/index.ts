import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCourtMasterService } from "./delete-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtMasterRepository } from "@/repositories/court-master-repository";

export const deleteCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCourtMasterService({
    courtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-court-master-service";
