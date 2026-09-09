import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteQRConfigurationMasterService } from "./delete-qr-configuration-master-service";
import { getSessionService } from "@/services/get-session-service";
import { qrConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

export const deleteQRConfigurationMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteQRConfigurationMasterService({
    qrConfigurationMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-qr-configuration-master-service";
