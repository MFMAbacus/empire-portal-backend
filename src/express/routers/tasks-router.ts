import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getTasksService} from '@/services/get-tasks-service';
import {getTaskService} from '@/services/get-task-service';
import {createTaskService} from '@/services/create-task';
import {deleteTaskService} from '@/services/delete-task-service';
import {assignTaskService} from '@/services/assign-task-service';
import {completeTaskService} from '@/services/complete-task-service';
import {pauseTaskService} from '@/services/pause-task-service';
import {resumeTaskService} from '@/services/resume-task-service';
import {taskCheckInService} from '@/services/task-check-in-service';
import {taskCheckOutService} from '@/services/task-check-out-service';
import {createSubTaskService} from '@/services/create-sub-task';
import {assignSubTaskService} from '@/services/assign-sub-task';
import {completeSubTaskService} from '@/services/complete-sub-task';
import {closeTaskService} from '@/services/close-task-service';

// eslint-disable-next-line new-cap
export const tasksRouter = express.Router();

tasksRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getTasksService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.get('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.delete('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/assign', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await assignTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/complete', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await completeTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/pause', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await pauseTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/resume', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await resumeTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/close', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await closeTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/check-in', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await taskCheckInService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:id/check-out', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await taskCheckOutService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

tasksRouter.post('/:taskId/sub-tasks', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createSubTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// eslint-disable-next-line max-len
tasksRouter.post('/:taskId/sub-tasks/:subTaskId/assign', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await assignSubTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// eslint-disable-next-line max-len
tasksRouter.post('/:taskId/sub-tasks/:subTaskId/complete', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await completeSubTaskService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
