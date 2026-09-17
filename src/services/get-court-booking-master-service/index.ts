import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtBookingMasterService } from "./get-court-booking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

export const getCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtBookingMasterService({
    courtBookingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-court-booking-master-service";
