import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetVenueMasterService } from "./get-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueMasterRepository } from "@/repositories/venue-master-repository";
import { GetMobileVenueMasterService } from "./get-mobile-venue-master-service";

export const getVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetVenueMasterService({
    venueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileVenueMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-venue-master-service";
export * from "./get-mobile-venue-master-service";