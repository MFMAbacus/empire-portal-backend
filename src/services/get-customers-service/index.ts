import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetUsersService} from './get-customers-service';

import {customerRepository} from '@/repositories/customer-repository';
import {getSessionService} from '@/services/get-session-service';

export const getCustomersService = new AccessMediatorService({
  getSessionService,
  service: new GetUsersService({
    customerRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './get-customers-service';
