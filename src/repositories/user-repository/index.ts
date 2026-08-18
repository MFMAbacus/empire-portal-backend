import { UserRepository } from "./user-repository";
import { UserRepositoryDb } from "./user-repository-db";

export const userRepository: UserRepository = new UserRepositoryDb();

export * from "./user-repository";
export * from "./user-repository-db";
