import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleEmailTemplateMasterService } from "./get-single-email-template-master-service";
import { getSessionService } from "@/services/get-session-service";
import { emailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

export const getSingleEmailTemplateMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleEmailTemplateMasterService({
    emailTemplateMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-email-template-master-service";
