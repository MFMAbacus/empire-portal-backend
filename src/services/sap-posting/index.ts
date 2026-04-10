import { AccessMediatorService } from "@/services/access-mediator-service";
import { PostPaymentToSap } from "./sap-postting";

import { getSessionService } from "@/services/get-session-service";
import { paymentRepository } from "@/repositories/payment-repository";

export const postPaymentToSap = new AccessMediatorService({
  getSessionService,
  service: new PostPaymentToSap({
    paymentRepository,
  }),
  roles: ["manager"],
});

export * from "./sap-postting";
