import { requestRepository } from "@/repositories/request-repository";
import { paymentRepository } from "@/repositories/payment-repository";
import { userRepository } from "@/repositories/user-repository";

import { HyperPayPaymentService } from "./hyperpay-payment-service";
import { getSessionService } from "../get-session-service";
import { AccessMediatorService } from "../access-mediator-service";

export const hyperPayPaymentService = new AccessMediatorService({
  getSessionService,
  service: new HyperPayPaymentService({
    requestRepository,
    paymentRepository,
    userRepository,
  }),
  roles: ["manager", "customer", "staff"],
});

export { HyperPayPaymentService };
