import {AccessMediatorService} from '@/services/access-mediator-service';
import {CreateUserService} from './create-user-service';

import {getSessionService} from '@/services/get-session-service';
import {userRepository} from '@/repositories/user-repository';

export const createUserService = new AccessMediatorService({
  getSessionService,
  service: new CreateUserService({
    userRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './create-user-service';
