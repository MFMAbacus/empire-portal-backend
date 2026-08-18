import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CompleteRequestService} from './complete-request-service';

import {requestRepository} from '@/repositories/request-repository';

export const completeRequestService = new AccessMediatorService({
  getSessionService,
  service: new CompleteRequestService({
    requestRepository,
  }),
  roles: [
    'staff',
  ],
});

export * from './complete-request-service';
