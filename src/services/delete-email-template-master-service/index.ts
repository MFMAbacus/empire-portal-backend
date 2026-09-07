import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteEmailTemplateMasterService } from "./delete-email-template-master-service";
import { getSessionService } from "@/services/get-session-service";
import { emailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

export const deleteEmailTemplateMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteEmailTemplateMasterService({
    emailTemplateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-email-template-master-service";
