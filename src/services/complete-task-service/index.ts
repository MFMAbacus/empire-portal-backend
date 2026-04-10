import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CompleteTaskService} from './complete-task-service';

import {taskRepository} from '@/repositories/task-repository';

export const completeTaskService = new AccessMediatorService({
  getSessionService,
  service: new CompleteTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './complete-task-service';
