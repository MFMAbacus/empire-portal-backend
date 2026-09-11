import { ICardReplacementReasonMaster } from "@/schemas/card-replacement-reason-master-schema";

export type GetAllCardReplacementReasonMasterOptions = {
  isArchived?: boolean;
};

export abstract class CardReplacementReasonMasterRepository {
  public abstract getAll(options?: GetAllCardReplacementReasonMasterOptions): Promise<ICardReplacementReasonMaster[]>;
  public abstract get(id: string): Promise<ICardReplacementReasonMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICardReplacementReasonMaster>): Promise<ICardReplacementReasonMaster>;
  public abstract Update(record: Partial<ICardReplacementReasonMaster>): Promise<ICardReplacementReasonMaster | undefined>;
  public abstract delete(id: string): Promise<ICardReplacementReasonMaster | null>;
}
