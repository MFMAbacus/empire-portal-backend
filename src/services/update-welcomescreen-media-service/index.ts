import { UpdateWelcomescreenMediaService } from './update-welcomescreen-media-service';
import { welcomescreenMediaRepository } from '@/repositories/welcomescreen-media-repository';

export const updateWelcomescreenMediaService = new UpdateWelcomescreenMediaService({
  welcomescreenMediaRepository,
});

export * from './update-welcomescreen-media-service';