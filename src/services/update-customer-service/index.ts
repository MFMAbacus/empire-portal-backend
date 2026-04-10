import {AccessMediatorService} from '@/services/access-mediator-service';
import {UpdateCustomerService} from './update-customer-service';

import {getSessionService} from '@/services/get-session-service';
import {customerRepository} from '@/repositories/customer-repository';

export const updateCustomerService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
    'customer',
  ],
});

export * from './update-customer-service';
