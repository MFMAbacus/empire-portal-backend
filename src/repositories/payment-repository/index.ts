import { PaymentRepository } from "./payment-repository";
import { PaymentRepositoryDb } from "./payment-repository-db";

export const paymentRepository: PaymentRepository = new PaymentRepositoryDb();

export * from "./payment-repository";
export * from "./payment-repository-db";
