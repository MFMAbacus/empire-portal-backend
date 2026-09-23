import { GetSingleGuestAccessService } from "./get-single-guest-access-service";
import { guestAccessRepository } from "@/repositories/guest-access-repository";
export const getSingleGuestAccessService = new GetSingleGuestAccessService({ guestAccessRepository });
export * from "./get-single-guest-access-service";
