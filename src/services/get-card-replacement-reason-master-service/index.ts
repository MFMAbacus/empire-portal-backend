import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCardReplacementReasonMasterService } from "./get-card-replacement-reason-master-service";
import { getSessionService } from "@/services/get-session-service";
import { cardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

export const getCardReplacementReasonMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCardReplacementReasonMasterService({
    cardReplacementReasonMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-card-replacement-reason-master-service";
