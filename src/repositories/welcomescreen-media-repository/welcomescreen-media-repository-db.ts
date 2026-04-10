import {
  IWelcomescreenMediaRecord,
  WelcomescreenMedia,
} from "@/schemas/welcomescreen-media-schema";
import { MongoRepository } from "@/utility/mongo-repository";

export class WelcomescreenMediaRepositoryDb extends MongoRepository<IWelcomescreenMediaRecord> {
  public constructor() {
    super(WelcomescreenMedia);
  }

  public async getAll(): Promise<IWelcomescreenMediaRecord[]> {
    return super.getAll();
  }

  public async Create(record: IWelcomescreenMediaRecord): Promise<void> {
    await super.create(record);
  }

  public async getActive(): Promise<IWelcomescreenMediaRecord[] | undefined> {
    const result = await this.Find({ isActive: true });
    return result ?? undefined;
  }

  public async get(id: string): Promise<IWelcomescreenMediaRecord | undefined> {
    return await super.findOneByField("_id", id);
  }

  public async update(
    record: Partial<IWelcomescreenMediaRecord>
  ): Promise<IWelcomescreenMediaRecord | undefined> {
    return await super._update({ ...record });
  }

  public async deactivateAll(): Promise<void> {
    await WelcomescreenMedia.updateMany({}, { isActive: false });
  }
}
