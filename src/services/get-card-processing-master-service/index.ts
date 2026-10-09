import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { GetCardProcessingMasterService } from "./get-card-processing-master-service";

export * from "./get-card-processing-master-service";

export const makeGetCardProcessingMasterService = () =>
  new GetCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  });
