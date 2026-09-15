import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleVenueOperatingMasterService } from "./get-single-venue-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

export const getSingleVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleVenueOperatingMasterService({
    venueOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-venue-operating-master-service";
