import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateVenueOperatingMasterService } from "./create-venue-operating-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

export const createVenueOperatingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateVenueOperatingMasterService({
    venueOperatingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-venue-operating-master-service";
