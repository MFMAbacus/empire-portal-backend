import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
import { FastpayPaymentInService } from "./fastpay-payment-service";
import { invoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { requestRepository } from "@/repositories/request-repository";
import { paymentRepository } from "@/repositories/payment-repository";
import { userRepository } from "@/repositories/user-repository";

export const createPaymentService = new AccessMediatorService({
  getSessionService,
  service: new FastpayPaymentInService({
    requestRepository,
    paymentRepository,
    userRepository,
  }),
  roles: ["manager", "customer", "staff"],
});

export * from "./fastpay-payment-service";
