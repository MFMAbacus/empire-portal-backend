import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateReservationRuleMasterService } from "./update-reservation-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { reservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

export const updateReservationRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateReservationRuleMasterService({
    reservationRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-reservation-rule-master-service";
