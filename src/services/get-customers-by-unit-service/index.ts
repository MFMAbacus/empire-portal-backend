import { GetCustomersByUnitService } from './get-customers-by-unit-service';
import { CustomerRepositoryDb } from '@/repositories/customer-repository/customer-repository-db';

const customerRepository = new CustomerRepositoryDb();

export const getCustomersByUnitService = new GetCustomersByUnitService({
  customerRepository,
});