import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {AssignTaskService} from './assign-task-service';

import {taskRepository} from '@/repositories/task-repository';
import {userRepository} from '@/repositories/user-repository';

export const assignTaskService = new AccessMediatorService({
  getSessionService,
  service: new AssignTaskService({
    userRepository,
    taskRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './assign-task-service';
