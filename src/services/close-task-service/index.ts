import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CloseTaskService} from './close-task-service';

import {taskRepository} from '@/repositories/task-repository';

export const closeTaskService = new AccessMediatorService({
  getSessionService,
  service: new CloseTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './close-task-service';
