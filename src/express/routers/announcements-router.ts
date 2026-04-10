import express from 'express';

import {presentResult} from '@/express/present-result';
import {combineRequestInput} from '@/express/combine-request-input';

import {getAnnouncementsService} from '@/services/get-announcements-service';
import {getAnnouncementService} from '@/services/get-announcement-service';
// eslint-disable-next-line max-len
import {createAnnouncementService} from '@/services/create-announcement-service';
// eslint-disable-next-line max-len
import {updateAnnouncementService} from '@/services/update-announcement-service';
// eslint-disable-next-line max-len
import {deleteAnnouncementService} from '@/services/delete-announcement-service';

// eslint-disable-next-line new-cap
export const announcementsRouter = express.Router();

announcementsRouter.get('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getAnnouncementsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

announcementsRouter.get('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getAnnouncementService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

announcementsRouter.post('/', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createAnnouncementService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

announcementsRouter.patch('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateAnnouncementService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

announcementsRouter.delete('/:id', async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteAnnouncementService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
