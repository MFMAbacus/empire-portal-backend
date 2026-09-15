import { UserRoleRepositoryDb } from "./role-repository-db";

export const userRoleRepository = new UserRoleRepositoryDb();

export * from "./role-repository";
export * from "./role-repository-db";
