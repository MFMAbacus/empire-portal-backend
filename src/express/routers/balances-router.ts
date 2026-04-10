import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

// eslint-disable-next-line max-len
import {getCustomerBalancesService} from '@/services/get-customer-balances-service';

// eslint-disable-next-line new-cap
export const balancesRouter = express.Router();

balancesRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCustomerBalancesService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
