import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateDeliverySLAMasterService } from "./update-delivery-sla-master-service";
import { getSessionService } from "@/services/get-session-service";
import { deliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

export const updateDeliverySLAMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateDeliverySLAMasterService({
    deliverySLAMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-delivery-sla-master-service";
