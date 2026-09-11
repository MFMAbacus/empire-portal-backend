import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetAccessCardMasterService } from "./get-access-card-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardMasterRepository } from "@/repositories/access-card-master-repository";

export const getAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetAccessCardMasterService({
    accessCardMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-access-card-master-service";
