import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getFloorsService} from '@/services/get-floors-service';

// eslint-disable-next-line new-cap
export const floorsRouter = express.Router();

floorsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getFloorsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
