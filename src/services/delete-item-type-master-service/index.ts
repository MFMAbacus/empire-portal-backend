import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteItemTypeMasterService } from "./delete-item-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { itemTypeMasterRepository } from "@/repositories/item-type-master-repository";

export const deleteItemTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteItemTypeMasterService({
    itemTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-item-type-master-service";
