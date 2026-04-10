import { CreateWelcomescreenMediaService } from './create-welcomescreen-media-service';
import { welcomescreenMediaRepository } from '@/repositories/welcomescreen-media-repository';

export const createWelcomescreenMediaService = new CreateWelcomescreenMediaService({
  welcomescreenMediaRepository,
});

export * from './create-welcomescreen-media-service';