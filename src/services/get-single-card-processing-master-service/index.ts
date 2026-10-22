import { AccessMediatorService } from "@/services/access-mediator-service";
import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { GetSingleCardProcessingMasterService } from "./get-single-card-processing-master-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./get-single-card-processing-master-service";

export const getSingleCardProcessingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  }),
  roles: ["manager", "staff", "customer"],
});

export const makeGetSingleCardProcessingMasterService = () => getSingleCardProcessingMasterService;
