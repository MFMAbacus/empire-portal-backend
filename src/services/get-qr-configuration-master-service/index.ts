import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetQRConfigurationMasterService } from "./get-qr-configuration-master-service";
import { getSessionService } from "@/services/get-session-service";
import { qrConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

export const getQRConfigurationMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetQRConfigurationMasterService({
    qrConfigurationMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-qr-configuration-master-service";
