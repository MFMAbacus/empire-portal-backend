import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getSalesPersonsService} from '@/services/get-salespersons-service';

// eslint-disable-next-line new-cap
export const salespersonsRouter = express.Router();

salespersonsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSalesPersonsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
