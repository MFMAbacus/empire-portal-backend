import {AccessMediatorService} from '@/services/access-mediator-service';
import {CreateCustomerService} from './create-customer-service';

import {getSessionService} from '@/services/get-session-service';
import {customerRepository} from '@/repositories/customer-repository';

export const createCustomerService = new AccessMediatorService({
  getSessionService,
  service: new CreateCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './create-customer-service';
