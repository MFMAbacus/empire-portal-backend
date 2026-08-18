import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetCategoriesService} from './get-categories-service';

import {categoryRepository} from '@/repositories/category-repository';
import {getSessionService} from '@/services/get-session-service';

export const getCategoriesService = new AccessMediatorService({
  getSessionService,
  service: new GetCategoriesService({
    categoryRepository,
  }),
  roles: [
    'manager',
    'staff',
    'customer',
  ],
});

export * from './get-categories-service';
