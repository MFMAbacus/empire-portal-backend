import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getUnitsService} from '@/services/get-units-service';

// eslint-disable-next-line new-cap
export const unitsRouter = express.Router();

unitsRouter.post('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getUnitsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
