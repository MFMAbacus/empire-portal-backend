import { IEmailTemplateMaster } from "@/schemas/email-template-master-schema";

export type GetAllEmailTemplateMasterOptions = {
  isArchived?: boolean;
};

export abstract class EmailTemplateMasterRepository {
  public abstract getAll(options?: GetAllEmailTemplateMasterOptions): Promise<IEmailTemplateMaster[]>;
  public abstract get(id: string): Promise<IEmailTemplateMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IEmailTemplateMaster>): Promise<IEmailTemplateMaster>;
  public abstract Update(record: Partial<IEmailTemplateMaster>): Promise<IEmailTemplateMaster | undefined>;
  public abstract delete(id: string): Promise<IEmailTemplateMaster | null>;
}
