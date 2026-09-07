import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteUserMasterService } from "./delete-user-master-service";
import { getSessionService } from "@/services/get-session-service";
import { userMasterRepository } from "@/repositories/user-master-repository";

export const deleteUserMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteUserMasterService({
    userMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-user-master-service";
