import { ICardProcessingMaster } from "@/schemas/card-processing-master-schema";

export type GetAllCardProcessingOptions = {
  isArchived?: boolean;
  residentId?: string;
  projectCode?: string;
  projectCodes?: string[];
  userId?: string;
};

export interface CardProcessingMasterRepository {
  getAll(options?: GetAllCardProcessingOptions): Promise<ICardProcessingMaster[]>;
  get(id: string): Promise<ICardProcessingMaster | undefined>;
  exists(id: string): Promise<boolean>;
  Create(record: ICardProcessingMaster): Promise<void>;
  Update(record: Partial<ICardProcessingMaster>): Promise<ICardProcessingMaster | undefined>;
  delete(id: string): Promise<ICardProcessingMaster | null>;
}
