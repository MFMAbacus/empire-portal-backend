import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getCountsService} from '@/services/get-counts-service';
import {getStatsService} from '@/services/get-stats-service';

// eslint-disable-next-line new-cap
export const reportsRouter = express.Router();

reportsRouter.get('/counts', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCountsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

reportsRouter.get('/stats', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getStatsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
