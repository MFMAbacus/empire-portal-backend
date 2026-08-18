import { AnnouncementRecord } from "@/records/announcement-record";
import { IAnnouncement } from "@/schemas/announcements-schema";

export type GetAllOptions = {
  bp?: string;
  pr?: string;
  bl?: string;
  fl?: string;
  un?: string;
};

export abstract class AnnouncementRepository {
  // eslint-disable-next-line max-len
  public abstract getAll(options?: GetAllOptions): Promise<IAnnouncement[]>;
  public abstract get(id: string): Promise<IAnnouncement | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: IAnnouncement): Promise<void>;
  public abstract Update(
    record: IAnnouncement
  ): Promise<IAnnouncement | undefined>;
  public abstract delete(id: string): Promise<IAnnouncement | null>;
}
