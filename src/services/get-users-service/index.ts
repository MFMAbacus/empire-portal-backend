import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetUsersService} from './get-users-service';

import {getSessionService} from '@/services/get-session-service';
import {userRepository} from '@/repositories/user-repository';

export const getUsersService = new AccessMediatorService({
  getSessionService,
  service: new GetUsersService({
    userRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './get-users-service';
