import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateVenueOperatingMasterService } from "./update-venue-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

export const updateVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateVenueOperatingMasterService({
    venueOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-venue-operating-master-service";
