import { AccessMediatorService } from "@/services/access-mediator-service";
import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { CreateCardProcessingMasterService } from "./create-card-processing-master-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./create-card-processing-master-service";

export const createCardProcessingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  }),
  roles: ["manager", "staff", "customer"],
});

export const makeCreateCardProcessingMasterService = () => createCardProcessingMasterService;
