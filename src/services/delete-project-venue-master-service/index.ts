import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteProjectVenueMasterService } from "./delete-project-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

export const deleteProjectVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteProjectVenueMasterService({
    projectVenueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-project-venue-master-service";
