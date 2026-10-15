import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetProjectVenueMasterService } from "./get-project-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { projectVenueMasterRepository } from "@/repositories/project-venue-master-repository";
import { GetMobileProjectVenueMasterService } from "./get-mobile-project-venue-master-service";

export const getProjectVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetProjectVenueMasterService({
    projectVenueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileProjectVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileProjectVenueMasterService(),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-project-venue-master-service";
export * from "./get-mobile-project-venue-master-service";