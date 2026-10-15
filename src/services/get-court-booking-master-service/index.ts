import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtBookingMasterService } from "./get-court-booking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBookingMasterRepository } from "@/repositories/court-booking-master-repository";
import { GetMobileCourtBookingMasterService } from "./get-mobile-court-booking-master-service";

export const getCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtBookingMasterService({
    courtBookingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export const getMobileCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileCourtBookingMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-court-booking-master-service";
export * from "./get-mobile-court-booking-master-service";
