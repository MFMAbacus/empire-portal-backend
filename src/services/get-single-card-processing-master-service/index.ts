import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { GetSingleCardProcessingMasterService } from "./get-single-card-processing-master-service";

export * from "./get-single-card-processing-master-service";

export const makeGetSingleCardProcessingMasterService = () =>
  new GetSingleCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  });
