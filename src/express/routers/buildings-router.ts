import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getBuildingsService} from '@/services/get-buildings-service';

// eslint-disable-next-line new-cap
export const buildingsRouter = express.Router();

buildingsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getBuildingsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
