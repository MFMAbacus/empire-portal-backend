import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCardReplacementReasonMasterService } from "./delete-card-replacement-reason-master-service";
import { getSessionService } from "@/services/get-session-service";
import { cardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

export const deleteCardReplacementReasonMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCardReplacementReasonMasterService({
    cardReplacementReasonMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-card-replacement-reason-master-service";
