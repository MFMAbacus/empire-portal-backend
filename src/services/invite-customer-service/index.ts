import {AccessMediatorService} from '@/services/access-mediator-service';
import {InviteCustomerService} from './invite-customer-service';

import {customerRepository} from '@/repositories/customer-repository';
import {getSessionService} from '@/services/get-session-service';

export const inviteCustomerService = new AccessMediatorService({
  getSessionService,
  service: new InviteCustomerService({
    customerRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './invite-customer-service';
