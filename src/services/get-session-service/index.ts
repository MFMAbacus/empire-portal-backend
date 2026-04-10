import { GetSessionService } from "./get-session-service";

import { sessionRepository } from "@/repositories/session-repository";
import { userRepository } from "@/repositories/user-repository";

export const getSessionService = new GetSessionService({
  sessionRepository,
  userRepository,
});

export * from "./get-session-service";
