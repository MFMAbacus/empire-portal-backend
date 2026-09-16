import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleMenuMasterService } from "./get-single-menu-master-service";
import { getSessionService } from "@/services/get-session-service";
import { menuMasterRepository } from "@/repositories/menu-master-repository";

export const getSingleMenuMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleMenuMasterService({
    menuMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-menu-master-service";
