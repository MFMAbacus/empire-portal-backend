import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetIssuesService} from './get-issues-service';

export const getIssuesService = new AccessMediatorService({
  getSessionService,
  service: new GetIssuesService(),
  roles: [
    'manager',
    'staff',
    'customer',
  ],
});

export * from './get-issues-service';
