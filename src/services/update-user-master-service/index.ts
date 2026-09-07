import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateUserMasterService } from "./update-user-master-service";
import { getSessionService } from "@/services/get-session-service";
import { userMasterRepository } from "@/repositories/user-master-repository";

export const updateUserMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateUserMasterService({
    userMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-user-master-service";
