import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {SetRequestItemsService} from './set-request-items-service';

import {requestRepository} from '@/repositories/request-repository';

export const setRequestItemsService = new AccessMediatorService({
  getSessionService,
  service: new SetRequestItemsService({
    requestRepository,
  }),
  roles: [
    'manager',
    'staff',
    'customer',
  ],
});

export * from './set-request-items-service';
