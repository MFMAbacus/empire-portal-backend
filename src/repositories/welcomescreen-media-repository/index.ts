import { WelcomescreenMediaRepository } from "./welcomescreen-media-repository";
import { WelcomescreenMediaRepositoryDb } from "./welcomescreen-media-repository-db";

export const welcomescreenMediaRepository: WelcomescreenMediaRepository = (() => {
  return new WelcomescreenMediaRepositoryDb();
})();

export * from "./welcomescreen-media-repository";
export * from "./welcomescreen-media-repository-db";