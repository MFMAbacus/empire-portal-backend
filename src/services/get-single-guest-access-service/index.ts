import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleGuestAccessService } from "./get-single-guest-access-service";
import { getSessionService } from "@/services/get-session-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";

export const getSingleGuestAccessService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleGuestAccessService({
    guestAccessRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-guest-access-service";
