import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getDepartmentsService} from '@/services/get-departments-service';

// eslint-disable-next-line new-cap
export const departmentsRouter = express.Router();

departmentsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getDepartmentsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
