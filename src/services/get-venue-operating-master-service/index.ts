import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetVenueOperatingMasterService } from "./get-venue-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";
import { GetMobileVenueOperatingMasterService } from "./get-mobile-venue-operating-master-service";

export const getVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetVenueOperatingMasterService({
    venueOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileVenueOperatingMasterService(),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-venue-operating-master-service";
export * from "./get-mobile-venue-operating-master-service";