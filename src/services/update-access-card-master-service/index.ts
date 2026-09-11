import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateAccessCardMasterService } from "./update-access-card-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardMasterRepository } from "@/repositories/access-card-master-repository";

export const updateAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateAccessCardMasterService({
    accessCardMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-access-card-master-service";
