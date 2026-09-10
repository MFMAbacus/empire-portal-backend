import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateItemTypeMasterService } from "./create-item-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { itemTypeMasterRepository } from "@/repositories/item-type-master-repository";

export const createItemTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateItemTypeMasterService({
    itemTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-item-type-master-service";
