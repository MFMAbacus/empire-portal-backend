import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
// eslint-disable-next-line max-len
import {GetPaymentsService} from './get-payments-service';

import {paymentRepository} from '@/repositories/payment-repository';

export const getPaymentsService = new AccessMediatorService({
  getSessionService,
  service: new GetPaymentsService({
    paymentRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-payments-service';
