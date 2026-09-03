import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteApartmentMasterService } from "./delete-apartment-master-service";
import { getSessionService } from "@/services/get-session-service";
import { apartmentMasterRepository } from "@/repositories/apartment-master-repository";

export const deleteApartmentMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteApartmentMasterService({
    apartmentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-apartment-master-service";
