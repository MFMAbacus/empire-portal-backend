import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteResidentMasterService } from "./delete-resident-master-service";
import { getSessionService } from "@/services/get-session-service";
import { residentMasterRepository } from "@/repositories/resident-master-repository";

export const deleteResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteResidentMasterService({
    residentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-resident-master-service";
