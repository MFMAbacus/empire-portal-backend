import { IEmailTemplateMaster } from "@/schemas/email-template-master-schema";
import EmailTemplateMaster from "@/schemas/email-template-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  EmailTemplateMasterRepository,
  GetAllEmailTemplateMasterOptions,
} from "./email-template-master-repository";

export class EmailTemplateMasterRepositoryDb
  extends MongoRepository<IEmailTemplateMaster>
  implements EmailTemplateMasterRepository
{
  public constructor() {
    super(EmailTemplateMaster);
  }

  public async getAll(options: GetAllEmailTemplateMasterOptions = {}): Promise<IEmailTemplateMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IEmailTemplateMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IEmailTemplateMaster>): Promise<IEmailTemplateMaster> {
    return await super.create(record as IEmailTemplateMaster);
  }

  public async Update(record: Partial<IEmailTemplateMaster>): Promise<IEmailTemplateMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IEmailTemplateMaster | null> {
    return await super.delete(id);
  }
}
