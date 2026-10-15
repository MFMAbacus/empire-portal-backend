import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetGuestAccessService } from "./get-guest-access-service";
import { getSessionService } from "@/services/get-session-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";

export const getGuestAccessService = new AccessMediatorService({
  getSessionService,
  service: new GetGuestAccessService({
    guestAccessRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-guest-access-service";
