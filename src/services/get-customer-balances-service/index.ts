import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetCustomerBalancesService} from './get-customer-balances-service';

export const getCustomerBalancesService = new AccessMediatorService({
  getSessionService,
  service: new GetCustomerBalancesService(),
  roles: [
    'manager',
  ],
});

export * from './get-customer-balances-service';
