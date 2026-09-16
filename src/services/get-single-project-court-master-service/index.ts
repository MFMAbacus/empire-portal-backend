import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleProjectCourtMasterService } from "./get-single-project-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectCourtMasterRepository } from "@/repositories/project-court-master-repository";

export const getSingleProjectCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleProjectCourtMasterService({
    projectCourtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-project-court-master-service";
