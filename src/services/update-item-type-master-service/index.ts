import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateItemTypeMasterService } from "./update-item-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { itemTypeMasterRepository } from "@/repositories/item-type-master-repository";

export const updateItemTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateItemTypeMasterService({
    itemTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-item-type-master-service";
