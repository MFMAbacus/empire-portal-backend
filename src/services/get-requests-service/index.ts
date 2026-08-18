import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetRequestsService} from './get-requests-service';

import {getSessionService} from '@/services/get-session-service';
import {requestRepository} from '@/repositories/request-repository';

export const getRequestsService = new AccessMediatorService({
  getSessionService,
  service: new GetRequestsService({
    requestRepository,
  }),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './get-requests-service';
