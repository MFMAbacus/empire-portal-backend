import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCourtMasterService } from "./get-single-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtMasterRepository } from "@/repositories/court-master-repository";

export const getSingleCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCourtMasterService({
    courtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-court-master-service";
