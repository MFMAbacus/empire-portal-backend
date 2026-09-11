import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleReplacementFeeMasterService } from "./get-single-replacement-fee-master-service";
import { getSessionService } from "@/services/get-session-service";
import { replacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

export const getSingleReplacementFeeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleReplacementFeeMasterService({
    replacementFeeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-replacement-fee-master-service";
