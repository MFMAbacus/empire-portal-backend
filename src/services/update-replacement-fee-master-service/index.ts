import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateReplacementFeeMasterService } from "./update-replacement-fee-master-service";
import { getSessionService } from "@/services/get-session-service";
import { replacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

export const updateReplacementFeeMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateReplacementFeeMasterService({
    replacementFeeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-replacement-fee-master-service";
