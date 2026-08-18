import {AccessMediatorService} from '@/services/access-mediator-service';
import {DeleteTaskService} from './delete-task-service';

import {getSessionService} from '@/services/get-session-service';
import {taskRepository} from '@/repositories/task-repository';

export const deleteTaskService = new AccessMediatorService({
  getSessionService,
  service: new DeleteTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './delete-task-service';
