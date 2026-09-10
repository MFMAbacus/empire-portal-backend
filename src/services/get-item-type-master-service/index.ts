import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetItemTypeMasterService } from "./get-item-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { itemTypeMasterRepository } from "@/repositories/item-type-master-repository";

export const getItemTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetItemTypeMasterService({
    itemTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-item-type-master-service";
