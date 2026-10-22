import { AccessMediatorService } from "@/services/access-mediator-service";
import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { GetCardProcessingMasterService } from "./get-card-processing-master-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./get-card-processing-master-service";

export const getCardProcessingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  }),
  roles: ["manager", "staff", "customer"],
});

export const makeGetCardProcessingMasterService = () => getCardProcessingMasterService;
