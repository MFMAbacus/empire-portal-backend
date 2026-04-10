// announcement-repository-mongo.ts
import { IAnnouncement } from "@/schemas/announcements-schema/announcements-schema";
import Announcement from "@/schemas/announcements-schema/announcements-schema";
import { AnnouncementRecord } from "@/records/announcement-record";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  AnnouncementRepository,
  GetAllOptions,
} from "./announcement-repository";

export class AnnouncementRepositoryDb
  extends MongoRepository<IAnnouncement>
  implements AnnouncementRepository
{
  public constructor() {
    super(Announcement);
  }

  public async getAll(options: GetAllOptions = {}): Promise<IAnnouncement[]> {
    const filter: any = {};

    if (options.bp) {
      filter.bps = options.bp;
    }
    if (options.pr) {
      filter.prs = options.pr;
    }
    if (options.bl) {
      filter.bls = options.bl;
    }
    if (options.fl) {
      filter.fls = options.fl;
    }
    if (options.un) {
      filter.uns = options.un;
    }

    return super.getAll(filter);
  }

  public async get(id: string): Promise<IAnnouncement | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: IAnnouncement): Promise<void> {
    await super.create(record);
  }

  public async Update(
    record: Partial<IAnnouncement>
  ): Promise<IAnnouncement | undefined> {
    const data = await super.update(record);

    return data;
  }

  public async delete(id: string): Promise<IAnnouncement | null> {
    return await super.delete(id);
  }
}
