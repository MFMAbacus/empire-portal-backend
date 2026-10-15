import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetReplacementFeeMasterService } from "./get-replacement-fee-master-service";
import { getSessionService } from "@/services/get-session-service";
import { replacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";
import { GetMobileReplacementFeeMasterService } from "./get-mobile-replacement-fee-master-service";

export const getReplacementFeeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetReplacementFeeMasterService({
    replacementFeeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export const getMobileReplacementFeeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileReplacementFeeMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-replacement-fee-master-service";
export * from "./get-mobile-replacement-fee-master-service";