import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetTasksService } from "./get-tasks-service";

import { getSessionService } from "@/services/get-session-service";
import { taskRepository } from "@/repositories/task-repository";

export const getTasksService = new AccessMediatorService({
  getSessionService,
  service: new GetTasksService({
    taskRepository,
  }),
  roles: ["manager", "staff"],
});

export * from "./get-tasks-service";
