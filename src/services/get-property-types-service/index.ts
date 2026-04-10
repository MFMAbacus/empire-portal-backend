import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetPropertyTypesService} from './get-property-types-service';

export const getPropertyTypesService = new AccessMediatorService({
  getSessionService,
  service: new GetPropertyTypesService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-property-types-service';
