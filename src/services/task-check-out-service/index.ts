import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {TaskCheckOutService} from './task-check-out-service';

import {taskRepository} from '@/repositories/task-repository';

export const taskCheckOutService = new AccessMediatorService({
  getSessionService,
  service: new TaskCheckOutService({
    taskRepository,
  }),
  roles: [
    'staff',
  ],
});

export * from './task-check-out-service';
