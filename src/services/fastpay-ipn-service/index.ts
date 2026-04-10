import { FastpayIpnService } from "./fastpay-ipn-service";
import { paymentRepository } from "@/repositories/payment-repository";
import { requestRepository } from "@/repositories/request-repository";
import { userRepository } from "@/repositories/user-repository";
import { invoicePaymentRepository } from "@/repositories/invoice-payment-repository";

export const fastpayIpnService = new FastpayIpnService({
  requestRepository,
  paymentRepository,
  userRepository,
  invoicePaymentRepository,
});

export * from "./fastpay-ipn-service";
