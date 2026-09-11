import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleAccessCardMasterService } from "./get-single-access-card-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardMasterRepository } from "@/repositories/access-card-master-repository";

export const getSingleAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleAccessCardMasterService({
    accessCardMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-access-card-master-service";
