import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetCustomerProjectsService} from './get-customer-projects-service';

export const getCustomerProjectsService = new AccessMediatorService({
  getSessionService,
  service: new GetCustomerProjectsService(),
  roles: [
    'manager',
  ],
});

export * from './get-customer-projects-service';
