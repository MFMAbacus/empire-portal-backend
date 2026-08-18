import { GetActiveWelcomescreenMediaService } from "./get-active-welcomescreen-media-service";
import { welcomescreenMediaRepository } from "@/repositories/welcomescreen-media-repository";

export const getActiveWelcomescreenMediaService =
  new GetActiveWelcomescreenMediaService({
    welcomescreenMediaRepository,
  });

export * from "./get-active-welcomescreen-media-service";
