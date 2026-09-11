import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateReplacementFeeMasterService } from "./create-replacement-fee-master-service";
import { getSessionService } from "@/services/get-session-service";
import { replacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

export const createReplacementFeeMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateReplacementFeeMasterService({
    replacementFeeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-replacement-fee-master-service";
