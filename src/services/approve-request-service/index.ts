import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
// eslint-disable-next-line max-len
import {ApproveRequestService} from './approve-request-service';

import {requestRepository} from '@/repositories/request-repository';

export const approveRequestService = new AccessMediatorService({
  getSessionService,
  service: new ApproveRequestService({
    requestRepository,
  }),
  roles: [
    'customer',
  ],
});

export * from './approve-request-service';
