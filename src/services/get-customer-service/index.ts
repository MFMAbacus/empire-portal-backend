import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetCustomerService} from './get-customer-service';

import {customerRepository} from '@/repositories/customer-repository';
import {getSessionService} from '@/services/get-session-service';

export const getCustomerService = new AccessMediatorService({
  getSessionService,
  service: new GetCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
    'customer',
  ],
});

export * from './get-customer-service';
