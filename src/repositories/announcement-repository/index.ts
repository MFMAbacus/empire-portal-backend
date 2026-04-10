import { AnnouncementRepository } from "./announcement-repository";
import { AnnouncementRepositoryDb } from "./announcement-repository-db";

export const announcementRepository: AnnouncementRepository =
  new AnnouncementRepositoryDb();

export * from "./announcement-repository";
export * from "./announcement-repository-db";
