import {Request, Response} from 'express';

export const notFoundHandler = (
    request: Request,
    response: Response,
): void => {
  response.status(404).json({
    success: false,
    code: 'not-found',
  });
};
