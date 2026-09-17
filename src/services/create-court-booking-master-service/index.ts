import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCourtBookingMasterService } from "./create-court-booking-master-service";
import { getSessionService } from "@/services/get-session-service";
import { courtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

export const createCourtBookingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCourtBookingMasterService({
    courtBookingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-court-booking-master-service";
