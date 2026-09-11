import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCardReplacementReasonMasterService } from "./update-card-replacement-reason-master-service";
import { getSessionService } from "@/services/get-session-service";
import { cardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

export const updateCardReplacementReasonMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCardReplacementReasonMasterService({
    cardReplacementReasonMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-card-replacement-reason-master-service";
