import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
import { DeleteVehcile } from "./delete-vehicle";

import { vehicleRepository } from "@/repositories/vehicle-repository";
import { customerRepository } from "@/repositories/customer-repository";

export const deleteVehcile = new AccessMediatorService({
  getSessionService,
  service: new DeleteVehcile({
    vehicleRepository,
    customerRepository,
  }),
  roles: ["manager", "customer"],
});

export * from "./delete-vehicle";
