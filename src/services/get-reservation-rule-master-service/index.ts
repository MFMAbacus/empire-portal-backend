import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetReservationRuleMasterService } from "./get-reservation-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { reservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";
import { GetMobileReservationRuleMasterService } from "./get-mobile-reservation-rule-master-service";

export const getReservationRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetReservationRuleMasterService({
    reservationRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileReservationRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileReservationRuleMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-reservation-rule-master-service";
export * from "./get-mobile-reservation-rule-master-service";