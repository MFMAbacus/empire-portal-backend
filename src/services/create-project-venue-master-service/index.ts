import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateProjectVenueMasterService } from "./create-project-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

export const createProjectVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateProjectVenueMasterService({
    projectVenueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-project-venue-master-service";
