import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {SetRequestPinService} from './set-request-pin-service';

import {requestRepository} from '@/repositories/request-repository';

export const setRequestPinService = new AccessMediatorService({
  getSessionService,
  service: new SetRequestPinService({
    requestRepository,
  }),
  roles: [
    'staff',
  ],
});

export * from './set-request-pin-service';
