import { RetrySapPostingsService } from "./retry-sap-postings";
import { RequestRepositoryDb } from "@/repositories/request-repository";
import { PaymentRepositoryDb } from "@/repositories/payment-repository";
import { UserRepositoryDb } from "@/repositories/user-repository";

export const retrySapPostingsService = new RetrySapPostingsService({
  requestRepository: new RequestRepositoryDb(),
  userRepository: new UserRepositoryDb(),
  paymentRepository: new PaymentRepositoryDb(),
});

export * from "./retry-sap-postings";
