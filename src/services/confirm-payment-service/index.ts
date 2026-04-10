import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
// eslint-disable-next-line max-len
import {ConfirmPaymentService} from './confirm-payment-service';

import {requestRepository} from '@/repositories/request-repository';
import {paymentRepository} from '@/repositories/payment-repository';
import {userRepository} from '@/repositories/user-repository';

export const confirmPaymentService = new AccessMediatorService({
  getSessionService,
  service: new ConfirmPaymentService({
    requestRepository,
    paymentRepository,
    userRepository,
  }),
  roles: [
    'manager',
    'customer',
  ],
});

export * from './confirm-payment-service';
