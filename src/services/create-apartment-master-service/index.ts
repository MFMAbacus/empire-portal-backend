import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateApartmentMasterService } from "./create-apartment-master-service";
import { getSessionService } from "@/services/get-session-service";
import { apartmentMasterRepository } from "@/repositories/apartment-master-repository";

export const createApartmentMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateApartmentMasterService({
    apartmentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-apartment-master-service";
