import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getUsersService} from '@/services/get-users-service';
import {getUserService} from '@/services/get-user-service';
import {createUserService} from '@/services/create-user-service';
import {updateUserService} from '@/services/update-user-service';
import {deleteUserService} from '@/services/delete-user-service';

// eslint-disable-next-line new-cap
export const usersRouter = express.Router();

usersRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getUsersService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getUserService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createUserService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

usersRouter.patch('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateUserService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteUserService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
