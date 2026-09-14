import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetVenueMasterService } from "./get-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueMasterRepository } from "@/repositories/venue-master-repository";

export const getVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetVenueMasterService({
    venueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-venue-master-service";
