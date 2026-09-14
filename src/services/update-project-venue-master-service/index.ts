import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateProjectVenueMasterService } from "./update-project-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

export const updateProjectVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateProjectVenueMasterService({
    projectVenueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-project-venue-master-service";
