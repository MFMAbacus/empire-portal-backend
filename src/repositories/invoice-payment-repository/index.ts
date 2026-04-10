import { InvoicePaymentRepository } from "./invoice-payment-repository";
import { InvoicePaymentRepositoryDb } from "./invoice-payment-repository-db";

// eslint-disable-next-line max-len
export const invoicePaymentRepository: InvoicePaymentRepository =
  new InvoicePaymentRepositoryDb();

export * from "./invoice-payment-repository";
export * from "./invoice-payment-repository-db";
