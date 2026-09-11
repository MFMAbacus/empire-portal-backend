import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCardReplacementReasonMasterService } from "./get-single-card-replacement-reason-master-service";
import { getSessionService } from "@/services/get-session-service";
import { cardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

export const getSingleCardReplacementReasonMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCardReplacementReasonMasterService({
    cardReplacementReasonMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-card-replacement-reason-master-service";
