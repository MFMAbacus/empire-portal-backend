import {Request, Response, NextFunction} from 'express';

export const badRequestHandler = (
    error: unknown,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
  console.error(error);
  response.status(400).json({
    success: false,
    code: 'bad-request',
  });
};
