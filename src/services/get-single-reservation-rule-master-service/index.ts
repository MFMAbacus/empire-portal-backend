import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleReservationRuleMasterService } from "./get-single-reservation-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { reservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

export const getSingleReservationRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleReservationRuleMasterService({
    reservationRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-reservation-rule-master-service";
