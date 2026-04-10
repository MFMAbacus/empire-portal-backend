import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetFloorsService} from './get-floors-service';

export const getFloorsService = new AccessMediatorService({
  getSessionService,
  service: new GetFloorsService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-floors-service';
