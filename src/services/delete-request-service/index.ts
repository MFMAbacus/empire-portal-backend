import {AccessMediatorService} from '@/services/access-mediator-service';
import {DeleteRequestService} from './delete-request-service';

import {getSessionService} from '@/services/get-session-service';
import {requestRepository} from '@/repositories/request-repository';

export const deleteRequestService = new AccessMediatorService({
  getSessionService,
  service: new DeleteRequestService({
    requestRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './delete-request-service';
