import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getProjectsService} from '@/services/get-projects-service';
// eslint-disable-next-line max-len
import {getCustomerProjectsService} from '@/services/get-customer-projects-service';

// eslint-disable-next-line new-cap
export const projectsRouter = express.Router();

projectsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getProjectsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

projectsRouter.get('/customer', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCustomerProjectsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
