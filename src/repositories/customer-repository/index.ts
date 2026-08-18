import { CustomerRepository } from "./customer-repository";
import { CustomerRepositoryDb } from "./customer-repository-db";

// eslint-disable-next-line max-len
export const customerRepository: CustomerRepository = (() => {
  return new CustomerRepositoryDb();
})();

export * from "./customer-repository";
export * from "./customer-repository-db";
