import { UpdateGuestAccessService } from "./update-guest-access-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";
export const updateGuestAccessService = new UpdateGuestAccessService({ guestAccessRepository });
export * from "./update-guest-access-service";
