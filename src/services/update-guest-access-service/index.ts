import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateGuestAccessService } from "./update-guest-access-service";
import { getSessionService } from "@/services/get-session-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";

export const updateGuestAccessService = new AccessMediatorService({
  getSessionService,
  service: new UpdateGuestAccessService({
    guestAccessRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-guest-access-service";
