import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteVenueMasterService } from "./delete-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueMasterRepository } from "@/repositories/venue-master-repository";

export const deleteVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteVenueMasterService({
    venueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-venue-master-service";
