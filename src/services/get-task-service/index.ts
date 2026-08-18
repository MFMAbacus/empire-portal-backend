import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetTaskService} from './get-task-service';

import {getSessionService} from '@/services/get-session-service';
import {taskRepository} from '@/repositories/task-repository';

export const getTaskService = new AccessMediatorService({
  getSessionService,
  service: new GetTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-task-service';
