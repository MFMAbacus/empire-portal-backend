import {AccessMediatorService} from '@/services/access-mediator-service';
import {UpdateUserService} from './update-user-service';

import {getSessionService} from '@/services/get-session-service';
import {userRepository} from '@/repositories/user-repository';

export const updateUserService = new AccessMediatorService({
  getSessionService,
  service: new UpdateUserService({
    userRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './update-user-service';
