import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleApartmentMasterService } from "./get-single-apartment-master-service";
import { getSessionService } from "@/services/get-session-service";
import { apartmentMasterRepository } from "@/repositories/apartment-master-repository";

export const getSingleApartmentMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleApartmentMasterService({
    apartmentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-apartment-master-service";
