import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleResidentMasterService } from "./get-single-resident-master-service";
import { getSessionService } from "@/services/get-session-service";
import { residentMasterRepository } from "@/repositories/resident-master-repository";

export const getSingleResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleResidentMasterService({
    residentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-resident-master-service";
