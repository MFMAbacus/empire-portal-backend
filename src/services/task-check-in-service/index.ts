import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {TaskCheckInService} from './task-check-in-service';

import {taskRepository} from '@/repositories/task-repository';

export const taskCheckInService = new AccessMediatorService({
  getSessionService,
  service: new TaskCheckInService({
    taskRepository,
  }),
  roles: [
    'staff',
  ],
});

export * from './task-check-in-service';
