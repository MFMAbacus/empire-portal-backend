import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateResidentMasterService } from "./update-resident-master-service";
import { getSessionService } from "@/services/get-session-service";
import { residentMasterRepository } from "@/repositories/resident-master-repository";

export const updateResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateResidentMasterService({
    residentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-resident-master-service";
