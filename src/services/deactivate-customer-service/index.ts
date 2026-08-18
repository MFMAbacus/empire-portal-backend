import { DeActivateCustomerService } from "./deactivate-customer-service";
import { AccessMediatorService } from "@/services/access-mediator-service";

import { getSessionService } from "@/services/get-session-service";
import { customerRepository } from "@/repositories/customer-repository";

export const deActivateCustomerService = new AccessMediatorService({
  getSessionService,
  service: new DeActivateCustomerService({
    customerRepository,
  }),
  roles: ["customer"],
});

export * from "./deactivate-customer-service";
