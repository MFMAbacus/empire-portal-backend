import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteReservationRuleMasterService } from "./delete-reservation-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { reservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

export const deleteReservationRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteReservationRuleMasterService({
    reservationRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-reservation-rule-master-service";
