import { AccessMediatorService } from "@/services/access-mediator-service";

import { getSessionService } from "@/services/get-session-service";
import { requestRepository } from "@/repositories/request-repository";
import { DeleteRequestItemService } from "./delete-request-item-service";

export const deleteItemRequestService = new AccessMediatorService({
  getSessionService,
  service: new DeleteRequestItemService({
    requestRepository,
  }),
  roles: ["staff"],
});

export * from "./delete-request-item-service";
