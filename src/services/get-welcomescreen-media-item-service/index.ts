import { GetWelcomescreenMediaItemService } from './get-welcomescreen-media-item-service';
import { welcomescreenMediaRepository } from '@/repositories/welcomescreen-media-repository';

export const getWelcomescreenMediaItemService = new GetWelcomescreenMediaItemService({
  welcomescreenMediaRepository,
});

export * from './get-welcomescreen-media-item-service';