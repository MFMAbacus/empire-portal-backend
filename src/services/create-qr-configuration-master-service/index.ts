import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateQRConfigurationMasterService } from "./create-qr-configuration-master-service";
import { getSessionService } from "@/services/get-session-service";
import { qrConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

export const createQRConfigurationMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateQRConfigurationMasterService({
    qrConfigurationMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-qr-configuration-master-service";
