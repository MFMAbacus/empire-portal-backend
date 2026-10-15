import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetAccessCardMasterService } from "./get-access-card-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardMasterRepository } from "@/repositories/access-card-master-repository";
import { GetMobileAccessCardMasterService } from "./get-mobile-access-card-master-service";

export const getAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetAccessCardMasterService({
    accessCardMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export const getMobileAccessCardMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileAccessCardMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-access-card-master-service";
export * from "./get-mobile-access-card-master-service";