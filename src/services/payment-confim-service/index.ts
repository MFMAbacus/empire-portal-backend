import { PaymentConfirmService } from "./payment-confirm-servce";
import { paymentRepository } from "@/repositories/payment-repository";
import { requestRepository } from "@/repositories/request-repository";
import { userRepository } from "@/repositories/user-repository";

export const paymentConfirmService = new PaymentConfirmService({
  requestRepository,
  paymentRepository,
  userRepository,
});

export * from "./payment-confirm-servce";
