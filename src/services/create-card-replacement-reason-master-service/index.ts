import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCardReplacementReasonMasterService } from "./create-card-replacement-reason-master-service";
import { getSessionService } from "@/services/get-session-service";
import { cardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

export const createCardReplacementReasonMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCardReplacementReasonMasterService({
    cardReplacementReasonMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-card-replacement-reason-master-service";
