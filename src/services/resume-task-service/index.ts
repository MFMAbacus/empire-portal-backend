import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {ResumeTaskService} from './resume-task-service';

import {taskRepository} from '@/repositories/task-repository';

export const resumeTaskService = new AccessMediatorService({
  getSessionService,
  service: new ResumeTaskService({
    taskRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './resume-task-service';
