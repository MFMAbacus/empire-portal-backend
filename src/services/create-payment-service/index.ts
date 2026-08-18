import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
// eslint-disable-next-line max-len
import {CreatePaymentService} from './create-payment-service';

import {requestRepository} from '@/repositories/request-repository';
import {paymentRepository} from '@/repositories/payment-repository';
import {userRepository} from '@/repositories/user-repository';

export const createPaymentService = new AccessMediatorService({
  getSessionService,
  service: new CreatePaymentService({
    requestRepository,
    paymentRepository,
    userRepository,
  }),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './create-payment-service';
