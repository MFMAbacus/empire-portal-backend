import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateEmailTemplateMasterService } from "./create-email-template-master-service";
import { getSessionService } from "@/services/get-session-service";
import { emailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

export const createEmailTemplateMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateEmailTemplateMasterService({
    emailTemplateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-email-template-master-service";
