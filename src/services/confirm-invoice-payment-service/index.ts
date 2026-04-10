import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
// eslint-disable-next-line max-len
import { ConfirmInvoicePaymentService } from "./confirm-invoice-payment-service";

// eslint-disable-next-line max-len
import { invoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { requestRepository } from "@/repositories/request-repository";
import { userRepository } from "@/repositories/user-repository";

export const confirmInvoicePaymentService = new ConfirmInvoicePaymentService({
  requestRepository,
  invoicePaymentRepository,
  userRepository,
});

export * from "./confirm-invoice-payment-service";
