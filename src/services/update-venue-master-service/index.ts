import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateVenueMasterService } from "./update-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueMasterRepository } from "@/repositories/venue-master-repository";

export const updateVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateVenueMasterService({
    venueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-venue-master-service";
