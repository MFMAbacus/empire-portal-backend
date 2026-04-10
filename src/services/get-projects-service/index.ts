import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetProjectsService} from './get-projects-service';

export const getProjectsService = new AccessMediatorService({
  getSessionService,
  service: new GetProjectsService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-projects-service';
