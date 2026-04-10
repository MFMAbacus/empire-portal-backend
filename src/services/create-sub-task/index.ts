import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CreateSubTaskService} from './create-sub-task-service';

import {taskRepository} from '@/repositories/task-repository';

export const createSubTaskService = new AccessMediatorService({
  getSessionService,
  service: new CreateSubTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './create-sub-task-service';
