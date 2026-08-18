import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetUserService} from './get-user-service';

import {getSessionService} from '@/services/get-session-service';
import {userRepository} from '@/repositories/user-repository';

export const getUserService = new AccessMediatorService({
  getSessionService,
  service: new GetUserService({
    userRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-user-service';
