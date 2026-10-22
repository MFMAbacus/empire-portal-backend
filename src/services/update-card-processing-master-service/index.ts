import { AccessMediatorService } from "@/services/access-mediator-service";
import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { UpdateCardProcessingMasterService } from "./update-card-processing-master-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./update-card-processing-master-service";

export const updateCardProcessingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  }),
  roles: ["manager", "staff", "customer"],
});

export const makeUpdateCardProcessingMasterService = () => updateCardProcessingMasterService;
