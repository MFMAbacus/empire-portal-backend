import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {AssignRequestService} from './assign-request-service';

import {requestRepository} from '@/repositories/request-repository';
import {userRepository} from '@/repositories/user-repository';

export const assignRequestService = new AccessMediatorService({
  getSessionService,
  service: new AssignRequestService({
    userRepository,
    requestRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './assign-request-service';
