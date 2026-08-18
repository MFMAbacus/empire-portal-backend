import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
import { CreateVehcile } from "./create-vehicle";

import { vehicleRepository } from "@/repositories/vehicle-repository";
import { customerRepository } from "@/repositories/customer-repository";

export const createVehcile = new AccessMediatorService({
  getSessionService,
  service: new CreateVehcile({
    vehicleRepository,
    customerRepository,
  }),
  roles: ["manager", "customer"],
});

export * from "./create-vehicle";
