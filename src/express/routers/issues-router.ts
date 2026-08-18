import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getIssuesService} from '@/services/get-issues-service';

// eslint-disable-next-line new-cap
export const issuesRouter = express.Router();

issuesRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getIssuesService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
