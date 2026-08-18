import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

// eslint-disable-next-line max-len
import {changeStaffPasswordService} from '@/services/change-staff-password';

// eslint-disable-next-line new-cap
export const staffRouter = express.Router();

// eslint-disable-next-line max-len
staffRouter.patch('/change-password', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await changeStaffPasswordService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
