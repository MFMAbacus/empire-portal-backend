import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteMenuMasterService } from "./delete-menu-master-service";
import { getSessionService } from "@/services/get-session-service";
import { menuMasterRepository } from "@/repositories/menu-master-repository";

export const deleteMenuMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteMenuMasterService({
    menuMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-menu-master-service";
