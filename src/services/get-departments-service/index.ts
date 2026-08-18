import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetDepartmentsService} from './get-departments-service';

export const getDepartmentsService = new AccessMediatorService({
  getSessionService,
  service: new GetDepartmentsService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-departments-service';
