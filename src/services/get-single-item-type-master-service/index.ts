import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleItemTypeMasterService } from "./get-single-item-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { itemTypeMasterRepository } from "@/repositories/item-type-master-repository";

export const getSingleItemTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleItemTypeMasterService({
    itemTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-item-type-master-service";
