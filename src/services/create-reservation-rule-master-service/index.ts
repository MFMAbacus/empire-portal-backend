import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateReservationRuleMasterService } from "./create-reservation-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { reservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

export const createReservationRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateReservationRuleMasterService({
    reservationRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-reservation-rule-master-service";
