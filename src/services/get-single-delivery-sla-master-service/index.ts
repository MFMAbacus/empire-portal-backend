import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleDeliverySLAMasterService } from "./get-single-delivery-sla-master-service";
import { getSessionService } from "@/services/get-session-service";
import { deliverySLAMasterRepository } from "@/repositories/delivery-sla-master-repository";

export const getSingleDeliverySLAMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleDeliverySLAMasterService({
    deliverySLAMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-delivery-sla-master-service";
