import { RequestRepository } from "./request-repository";
import { RequestRepositoryDb } from "./request-repository-db";

export const requestRepository: RequestRepository = new RequestRepositoryDb();

export * from "./request-repository";
export * from "./request-repository-db";
