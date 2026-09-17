import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCourtBookingMasterService } from "./get-single-court-booking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

export const getSingleCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCourtBookingMasterService({
    courtBookingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-court-booking-master-service";
