import {AccessMediatorService} from '@/services/access-mediator-service';
import {UnblockCustomerService} from './unblock-customer-service';

import {customerRepository} from '@/repositories/customer-repository';
import {getSessionService} from '@/services/get-session-service';

export const unblockCustomerService = new AccessMediatorService({
  getSessionService,
  service: new UnblockCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './unblock-customer-service';
