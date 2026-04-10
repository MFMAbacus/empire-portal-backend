import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetBuildingsService} from './get-buildings-service';

export const getBuildingsService = new AccessMediatorService({
  getSessionService,
  service: new GetBuildingsService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-buildings-service';
