import { MeetingRepository } from "./meeting-repository";
// import { MeetingRepositoryJson } from "./meeting-repository-json";
import { MeetingRepositoryDb } from "./meeting-repository-db";

export const meetingRepository: MeetingRepository = new MeetingRepositoryDb();

export * from "./meeting-repository";
// export * from "./meeting-repository-json";
