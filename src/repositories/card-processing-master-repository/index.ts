import { CardProcessingMasterRepositoryDb } from "./card-processing-master-repository-db";

export * from "./card-processing-master-repository";
export * from "./card-processing-master-repository-db";

export const makeCardProcessingMasterRepository = () =>
  new CardProcessingMasterRepositoryDb();
