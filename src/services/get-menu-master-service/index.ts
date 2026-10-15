import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMenuMasterService } from "./get-menu-master-service";
import { getSessionService } from "@/services/get-session-service";
import { menuMasterRepository } from "@/repositories/menu-master-repository";
import { GetMobileMenuMasterService } from "./get-mobile-menu-master-service";

export const getMenuMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMenuMasterService({
    menuMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileMenuMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileMenuMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-menu-master-service";
export * from "./get-mobile-menu-master-service";