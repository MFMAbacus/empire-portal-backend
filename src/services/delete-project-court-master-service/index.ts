import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteProjectCourtMasterService } from "./delete-project-court-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectCourtMasterRepository } from "@/repositories/project-court-master-repository";

export const deleteProjectCourtMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteProjectCourtMasterService({
    projectCourtMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-project-court-master-service";
