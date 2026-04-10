import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CreateTaskService} from './create-task-service';

import {customerRepository} from '@/repositories/customer-repository';
import {taskRepository} from '@/repositories/task-repository';
import {categoryRepository} from '@/repositories/category-repository';

export const createTaskService = new AccessMediatorService({
  getSessionService,
  service: new CreateTaskService({
    customerRepository,
    taskRepository,
    categoryRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './create-task-service';
