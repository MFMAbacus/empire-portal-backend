import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetResidentMasterService } from "./get-resident-master-service";
import { getSessionService } from "@/services/get-session-service";
import { residentMasterRepository } from "@/repositories/resident-master-repository";

export const getResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetResidentMasterService({
    residentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-resident-master-service";
