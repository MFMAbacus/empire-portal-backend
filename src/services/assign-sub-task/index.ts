import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {AssignSubTaskService} from './assign-sub-task-service';

import {userRepository} from '@/repositories/user-repository';
import {taskRepository} from '@/repositories/task-repository';

export const assignSubTaskService = new AccessMediatorService({
  getSessionService,
  service: new AssignSubTaskService({
    userRepository,
    taskRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './assign-sub-task-service';
