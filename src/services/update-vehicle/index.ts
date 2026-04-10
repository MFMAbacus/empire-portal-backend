import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
import { UpdateVehcile } from "./update-vehicle";

import { vehicleRepository } from "@/repositories/vehicle-repository";
import { customerRepository } from "@/repositories/customer-repository";

export const updateVehcile = new AccessMediatorService({
  getSessionService,
  service: new UpdateVehcile({
    vehicleRepository,
    customerRepository,
  }),
  roles: ["manager", "customer"],
});

export * from "./update-vehicle";
