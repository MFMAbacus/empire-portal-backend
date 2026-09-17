import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCourtBookingMasterService } from "./delete-court-booking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

export const deleteCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCourtBookingMasterService({
    courtBookingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-court-booking-master-service";
