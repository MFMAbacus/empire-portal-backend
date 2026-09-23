import { GetGuestAccessService } from "./get-guest-access-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";
export const getGuestAccessService = new GetGuestAccessService({ guestAccessRepository });
export * from "./get-guest-access-service";
