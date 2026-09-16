import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetProjectCourtMasterService } from "./get-project-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectCourtMasterRepository } from "@/repositories/project-court-master-repository";

export const getProjectCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetProjectCourtMasterService({
    projectCourtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-project-court-master-service";
