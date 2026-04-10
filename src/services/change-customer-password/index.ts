import {AccessMediatorService} from '@/services/access-mediator-service';
// eslint-disable-next-line max-len
import {ChangeCustomerPasswordService} from './change-customer-password-service';

import {customerRepository} from '@/repositories/customer-repository';
import {getSessionService} from '@/services/get-session-service';

export const changeCustomerPasswordService = new AccessMediatorService({
  getSessionService,
  service: new ChangeCustomerPasswordService({
    customerRepository,
  }),
  roles: [
    'customer',
  ],
});

export * from './change-customer-password-service';
