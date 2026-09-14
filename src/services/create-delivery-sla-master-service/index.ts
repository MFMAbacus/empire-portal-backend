import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateDeliverySLAMasterService } from "./create-delivery-sla-master-service";
import { getSessionService } from "@/services/get-session-service";
import { deliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

export const createDeliverySLAMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateDeliverySLAMasterService({
    deliverySLAMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-delivery-sla-master-service";
