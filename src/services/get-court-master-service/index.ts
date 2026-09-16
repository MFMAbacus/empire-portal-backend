import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtMasterService } from "./get-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtMasterRepository } from "@/repositories/court-master-repository";

export const getCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtMasterService({
    courtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-court-master-service";
