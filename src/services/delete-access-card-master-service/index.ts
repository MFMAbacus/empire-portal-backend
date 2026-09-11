import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteAccessCardMasterService } from "./delete-access-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardMasterRepository } from "@/repositories/access-card-master-repository";

export const deleteAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteAccessCardMasterService({
    accessCardMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-access-master-service";
