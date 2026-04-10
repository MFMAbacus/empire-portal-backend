import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getPropertyTypesService} from '@/services/get-property-types-service';

// eslint-disable-next-line new-cap
export const propertyTypesRouter = express.Router();

propertyTypesRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getPropertyTypesService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
