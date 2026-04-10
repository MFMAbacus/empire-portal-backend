import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CompleteSubTaskService} from './complete-sub-task-service';

import {taskRepository} from '@/repositories/task-repository';

export const completeSubTaskService = new AccessMediatorService({
  getSessionService,
  service: new CompleteSubTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './complete-sub-task-service';
