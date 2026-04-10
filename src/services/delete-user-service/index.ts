import {AccessMediatorService} from '@/services/access-mediator-service';
import {DeleteUserService} from './delete-user-service';

import {getSessionService} from '@/services/get-session-service';
import {userRepository} from '@/repositories/user-repository';

export const deleteUserService = new AccessMediatorService({
  getSessionService,
  service: new DeleteUserService({
    userRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './delete-user-service';
