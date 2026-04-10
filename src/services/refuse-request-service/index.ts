import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
// eslint-disable-next-line max-len
import {RefuseRequestService} from './refuse-request-service';

import {requestRepository} from '@/repositories/request-repository';

export const refuseRequestService = new AccessMediatorService({
  getSessionService,
  service: new RefuseRequestService({
    requestRepository,
  }),
  roles: [
    'customer',
  ],
});

export * from './refuse-request-service';
