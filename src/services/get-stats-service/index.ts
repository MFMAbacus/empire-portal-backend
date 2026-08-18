import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetStatsService} from './get-stats-service';

import {getSessionService} from '@/services/get-session-service';
import {requestRepository} from '@/repositories/request-repository';
import {taskRepository} from '@/repositories/task-repository';
import {customerRepository} from '@/repositories/customer-repository';
import {userRepository} from '@/repositories/user-repository';
import {announcementRepository} from '@/repositories/announcement-repository';

export const getStatsService = new AccessMediatorService({
  getSessionService,
  service: new GetStatsService({
    requestRepository,
    taskRepository,
    customerRepository,
    userRepository,
    announcementRepository,
  }),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './get-stats-service';
