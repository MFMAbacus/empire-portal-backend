import { GetWelcomescreenMediaService } from './get-welcomescreen-media-service';
import { welcomescreenMediaRepository } from '@/repositories/welcomescreen-media-repository';

export const getWelcomescreenMediaService = new GetWelcomescreenMediaService({
  welcomescreenMediaRepository,
});

export * from './get-welcomescreen-media-service';