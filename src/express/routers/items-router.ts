import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getItemsService} from '@/services/get-items-service';

// eslint-disable-next-line new-cap
export const itemsRouter = express.Router();

itemsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getItemsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
