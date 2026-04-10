import { CheckFibPaymentStatus } from "./check-fib-payment-status";
import { RequestRepositoryDb } from "@/repositories/request-repository";
import { PaymentRepositoryDb } from "@/repositories/payment-repository";
import { UserRepositoryDb } from "@/repositories/user-repository";
import { InvoicePaymentRepositoryDb } from "@/repositories/invoice-payment-repository";

export const checkFibPaymentStatus = new CheckFibPaymentStatus({
  requestRepository: new RequestRepositoryDb(),
  userRepository: new UserRepositoryDb(),
  paymentRepository: new PaymentRepositoryDb(),
  invoicePaymentRepository: new InvoicePaymentRepositoryDb(),
});

export * from "./check-fib-payment-status";
