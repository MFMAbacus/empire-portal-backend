import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateMenuMasterService } from "./update-menu-master-service";
import { getSessionService } from "@/services/get-session-service";
import { menuMasterRepository } from "@/repositories/menu-master-repository";

export const updateMenuMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateMenuMasterService({
    menuMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-menu-master-service";
