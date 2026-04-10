import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetCountsService} from './get-counts-service';

import {getSessionService} from '@/services/get-session-service';
import {requestRepository} from '@/repositories/request-repository';
import {taskRepository} from '@/repositories/task-repository';
import {meetingRepository} from '@/repositories/meeting-repository';

export const getCountsService = new AccessMediatorService({
  getSessionService,
  service: new GetCountsService({
    requestRepository,
    taskRepository,
    meetingRepository,
  }),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './get-counts-service';
