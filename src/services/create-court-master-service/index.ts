import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCourtMasterService } from "./create-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtMasterRepository } from "@/repositories/court-master-repository";

export const createCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCourtMasterService({
    courtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-court-master-service";
