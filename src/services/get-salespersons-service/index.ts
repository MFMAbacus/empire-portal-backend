import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetSalespersonsService} from './get-salespersons-service';

export const getSalesPersonsService = new AccessMediatorService({
  getSessionService,
  service: new GetSalespersonsService(),
  roles: [
    'manager',
  ],
});

export * from './get-salespersons-service';
