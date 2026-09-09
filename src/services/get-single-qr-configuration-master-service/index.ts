import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleQRConfigurationMasterService } from "./get-single-qr-configuration-master-service";
import { getSessionService } from "@/services/get-session-service";
import { qrConfigurationMasterRepository } from "@/repositories/qr-configuration-master-repository";

export const getSingleQRConfigurationMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleQRConfigurationMasterService({
    qrConfigurationMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-qr-configuration-master-service";
