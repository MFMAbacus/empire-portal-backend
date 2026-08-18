import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetItemsService} from './get-items-service';

export const getItemsService = new AccessMediatorService({
  getSessionService,
  service: new GetItemsService(),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-items-service';
