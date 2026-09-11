import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateAccessCardMasterService } from "./create-access-card-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardMasterRepository } from "@/repositories/access-card-master-repository";

export const createAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateAccessCardMasterService({
    accessCardMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-access-card-master-service";
