import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateProjectCourtMasterService } from "./create-project-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectCourtMasterRepository } from "@/repositories/project-court-master-repository";

export const createProjectCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateProjectCourtMasterService({
    projectCourtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-project-court-master-service";
