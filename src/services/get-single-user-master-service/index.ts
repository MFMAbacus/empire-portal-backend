import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleUserMasterService } from "./get-single-user-master-service";
import { getSessionService } from "@/services/get-session-service";
import { userMasterRepository } from "@/repositories/user-master-repository";

export const getSingleUserMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleUserMasterService({
    userMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-user-master-service";
