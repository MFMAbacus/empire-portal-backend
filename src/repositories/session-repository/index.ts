import { SessionRepository } from "./session-repository";
import { SessionRepositoryDb } from "./session-repository-db";

export const sessionRepository: SessionRepository = new SessionRepositoryDb();

export * from "./session-repository";
export * from "./session-repository-db";
