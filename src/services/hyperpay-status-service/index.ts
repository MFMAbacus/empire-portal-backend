import { requestRepository } from "@/repositories/request-repository";
import { paymentRepository } from "@/repositories/payment-repository";
import { invoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { userRepository } from "@/repositories/user-repository";

import { HyperPayStatusService } from "./hyperpay-status-service";

export const hyperPayStatusService = new HyperPayStatusService({
  requestRepository,
  paymentRepository,
  invoicePaymentRepository,
  userRepository,
});

export { HyperPayStatusService };