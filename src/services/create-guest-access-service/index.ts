import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateGuestAccessService } from "./create-guest-access-service";
import { getSessionService } from "@/services/get-session-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";

export const createGuestAccessService = new AccessMediatorService({
  getSessionService,
  service: new CreateGuestAccessService({
    guestAccessRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-guest-access-service";
