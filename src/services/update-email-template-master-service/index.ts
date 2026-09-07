import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateEmailTemplateMasterService } from "./update-email-template-master-service";
import { getSessionService } from "@/services/get-session-service";
import { emailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

export const updateEmailTemplateMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateEmailTemplateMasterService({
    emailTemplateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-email-template-master-service";
