import {AccessMediatorService} from '@/services/access-mediator-service';
import {BlockCustomerService} from './block-customer-service';

import {customerRepository} from '@/repositories/customer-repository';
import {getSessionService} from '@/services/get-session-service';

export const blockCustomerService = new AccessMediatorService({
  getSessionService,
  service: new BlockCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './block-customer-service';
