import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteReplacementFeeMasterService } from "./delete-replacement-fee-master-service";
import { getSessionService } from "@/services/get-session-service";
import { replacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

export const deleteReplacementFeeMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteReplacementFeeMasterService({
    replacementFeeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-replacement-fee-master-service";
