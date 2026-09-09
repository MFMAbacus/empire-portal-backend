import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateQRConfigurationMasterService } from "./update-qr-configuration-master-service";
import { getSessionService } from "@/services/get-session-service";
import { qrConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

export const updateQRConfigurationMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateQRConfigurationMasterService({
    qrConfigurationMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-qr-configuration-master-service";
