import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { CreateCardProcessingMasterService } from "./create-card-processing-master-service";

export * from "./create-card-processing-master-service";

export const makeCreateCardProcessingMasterService = () =>
  new CreateCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  });
