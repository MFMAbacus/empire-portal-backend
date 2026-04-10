import {Request} from 'express';

export const combineRequestInput = (request: Request) => {
  return {
    ...request.params,
    ...request.body,
    ...request.query,
  };
};
