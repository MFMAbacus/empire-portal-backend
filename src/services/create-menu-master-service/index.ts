import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateMenuMasterService } from "./create-menu-master-service";
import { getSessionService } from "@/services/get-session-service";
import { menuMasterRepository } from "@/repositories/menu-master-repository";

export const createMenuMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateMenuMasterService({
    menuMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-menu-master-service";
