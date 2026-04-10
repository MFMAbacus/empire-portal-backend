import {DeleteCustomerService} from './delete-customer-service';
import {AccessMediatorService} from '@/services/access-mediator-service';

import {getSessionService} from '@/services/get-session-service';
import {customerRepository} from '@/repositories/customer-repository';

export const deleteCustomerService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './delete-customer-service';
