import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateUserMasterService } from "./create-user-master-service";
import { getSessionService } from "@/services/get-session-service";
import { userMasterRepository } from "@/repositories/user-master-repository";

export const createUserMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateUserMasterService({
    userMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-user-master-service";
