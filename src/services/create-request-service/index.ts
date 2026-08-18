import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CreateRequestService} from './create-request-service';

import {customerRepository} from '@/repositories/customer-repository';
import {requestRepository} from '@/repositories/request-repository';
import {categoryRepository} from '@/repositories/category-repository';
import {userRepository} from '@/repositories/user-repository';

export const createRequestService = new AccessMediatorService({
  getSessionService,
  service: new CreateRequestService({
    customerRepository,
    requestRepository,
    categoryRepository,
    userRepository,
  }),
  roles: [
    'customer',
  ],
});

export * from './create-request-service';
