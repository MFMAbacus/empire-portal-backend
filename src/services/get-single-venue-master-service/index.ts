import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleVenueMasterService } from "./get-single-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueMasterRepository } from "@/repositories/venue-master-repository";

export const getSingleVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleVenueMasterService({
    venueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-venue-master-service";
