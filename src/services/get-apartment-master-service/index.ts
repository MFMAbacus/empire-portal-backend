import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetApartmentMasterService } from "./get-apartment-master-service";
import { getSessionService } from "@/services/get-session-service";
import { apartmentMasterRepository } from "@/repositories/apartment-master-repository";

export const getApartmentMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetApartmentMasterService({
    apartmentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-apartment-master-service";
