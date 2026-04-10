import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getCategoriesService} from '@/services/get-categories-service';

// eslint-disable-next-line new-cap
export const categoriesRouter = express.Router();

categoriesRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCategoriesService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
