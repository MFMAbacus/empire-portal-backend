import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {RateRequestService} from './rate-request-service';

import {requestRepository} from '@/repositories/request-repository';

export const rateRequestService = new AccessMediatorService({
  getSessionService,
  service: new RateRequestService({
    requestRepository,
  }),
  roles: [
    'customer',
  ],
});

export * from './rate-request-service';
