import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteDeliverySLAMasterService } from "./delete-delivery-sla-master-service";
import { getSessionService } from "@/services/get-session-service";
import { deliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

export const deleteDeliverySLAMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteDeliverySLAMasterService({
    deliverySLAMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-delivery-sla-master-service";
