import { CreateGuestAccessService } from "./create-guest-access-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";

export const createGuestAccessService = new CreateGuestAccessService({
  guestAccessRepository,
});

export * from "./create-guest-access-service";
