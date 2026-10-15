import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetDeliverySLAMasterService } from "./get-delivery-sla-master-service";
import { getSessionService } from "@/services/get-session-service";
import { deliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";
import { GetMobileDeliverySLAMasterService } from "./get-mobile-delivery-sla-master-service";

export const getDeliverySLAMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetDeliverySLAMasterService({
    deliverySLAMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileDeliverySLAMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileDeliverySLAMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-delivery-sla-master-service";
export * from "./get-mobile-delivery-sla-master-service";