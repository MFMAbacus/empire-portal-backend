import {AccessMediatorService} from '@/services/access-mediator-service';
import {RegisterClientSessionService} from './register-client-session-service';
import {getSessionService} from '@/services/get-session-service';

export const registerClientSessionService = new AccessMediatorService({
  getSessionService,
  service: new RegisterClientSessionService(),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './register-client-session-service';
