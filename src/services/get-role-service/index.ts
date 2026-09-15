import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetUserRoleService } from "./get-role-service";
import { getSessionService } from "@/services/get-session-service";
import { userRoleRepository } from "@/repositories/role-repository";

export const getUserRoleService = new AccessMediatorService({
  getSessionService,
  service: new GetUserRoleService({
    userRoleRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-role-service";
