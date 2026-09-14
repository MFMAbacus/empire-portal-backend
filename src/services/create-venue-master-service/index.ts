import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateVenueMasterService } from "./create-venue-master-service";
import { getSessionService } from "@/services/get-session-service";
import { venueMasterRepository } from "@/repositories/venue-master-repository";

export const createVenueMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateVenueMasterService({
    venueMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-venue-master-service";
