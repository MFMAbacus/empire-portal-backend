import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetUserMasterService } from "./get-user-master-service";
import { getSessionService } from "@/services/get-session-service";
import { userMasterRepository } from "@/repositories/user-master-repository";

export const getUserMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetUserMasterService({
    userMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-user-master-service";
