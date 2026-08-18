import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetRequestService} from './get-request-service';

import {getSessionService} from '@/services/get-session-service';
import {requestRepository} from '@/repositories/request-repository';

export const getRequestService = new AccessMediatorService({
  getSessionService,
  service: new GetRequestService({
    requestRepository,
  }),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './get-request-service';
