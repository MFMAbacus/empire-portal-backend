import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetUnitsService} from './get-units-service';

export const getUnitsService = new AccessMediatorService({
  getSessionService,
  service: new GetUnitsService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-units-service';
