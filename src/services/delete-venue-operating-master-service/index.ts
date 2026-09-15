import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteVenueOperatingMasterService } from "./delete-venue-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

export const deleteVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteVenueOperatingMasterService({
    venueOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-venue-operating-master-service";
