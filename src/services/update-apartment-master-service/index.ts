import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateApartmentMasterService } from "./update-apartment-master-service";
import { getSessionService } from "@/services/get-session-service";
import { apartmentMasterRepository } from "@/repositories/apartment-master-repository";

export const updateApartmentMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateApartmentMasterService({
    apartmentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-apartment-master-service";
