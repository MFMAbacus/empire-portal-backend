import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCourtBookingMasterService } from "./update-court-booking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

export const updateCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCourtBookingMasterService({
    courtBookingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-court-booking-master-service";
