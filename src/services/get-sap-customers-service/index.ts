import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSapCustomersService } from "./get-sap-customers-service";

import { customerRepository } from "@/repositories/customer-repository";
import { getSessionService } from "@/services/get-session-service";

export const getSapCustomersService = new AccessMediatorService({
  getSessionService,
  service: new GetSapCustomersService({
    customerRepository,
  }),
  roles: ["manager"],
});

export * from "./get-sap-customers-service";
