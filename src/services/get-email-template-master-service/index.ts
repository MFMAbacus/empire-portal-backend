import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetEmailTemplateMasterService } from "./get-email-template-master-service";
import { getSessionService } from "@/services/get-session-service";
import { emailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

export const getEmailTemplateMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetEmailTemplateMasterService({
    emailTemplateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-email-template-master-service";
