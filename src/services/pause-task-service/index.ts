import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {PauseTaskService} from './pause-task-service';

import {taskRepository} from '@/repositories/task-repository';

export const pauseTaskService = new AccessMediatorService({
  getSessionService,
  service: new PauseTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './pause-task-service';
