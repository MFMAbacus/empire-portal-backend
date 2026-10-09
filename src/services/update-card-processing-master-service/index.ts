import { makeCardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { UpdateCardProcessingMasterService } from "./update-card-processing-master-service";

export * from "./update-card-processing-master-service";

export const makeUpdateCardProcessingMasterService = () =>
  new UpdateCardProcessingMasterService({
    cardProcessingMasterRepository: makeCardProcessingMasterRepository(),
  });
