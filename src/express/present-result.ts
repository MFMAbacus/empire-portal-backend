import {Response} from 'express';

import {Failure} from '@/utility/failure';
import {Result} from '@/utility/result';

export const presentResult = (
    result: Result<unknown, unknown>,
    response: Response,
) => {
  if (result.hasFailed()) {
    const failure = result.getFailure();

    if (!(failure instanceof Failure)) {
      return response.status(500).json({
        success: false,
        code: 'internal-server-error',
      });
    }

    const failureCode = failure.getCode();
    const statusCode = 400;

    return response.status(statusCode).json({
      success: false,
      code: failureCode,
      data: failure.getData(),
    });
  }

  return response.status(200).json({
    success: true,
    code: 'success',
    data: result.getValue(),
  });
};
