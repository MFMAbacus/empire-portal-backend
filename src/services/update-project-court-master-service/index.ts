import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateProjectCourtMasterService } from "./update-project-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectCourtMasterRepository } from "@/repositories/project-court-master-repository";

export const updateProjectCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateProjectCourtMasterService({
    projectCourtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-project-court-master-service";
