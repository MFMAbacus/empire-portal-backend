import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetVenueOperatingMasterService } from "./get-venue-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

export const getVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetVenueOperatingMasterService({
    venueOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-venue-operating-master-service";
