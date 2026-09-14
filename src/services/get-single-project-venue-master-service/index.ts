import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleProjectVenueMasterService } from "./get-single-project-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

export const getSingleProjectVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleProjectVenueMasterService({
    projectVenueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-project-venue-master-service";
