import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateResidentMasterService } from "./create-resident-master-service";
import { getSessionService } from "@/services/get-session-service";
import { residentMasterRepository } from "@/repositories/resident-master-repository";

export const createResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateResidentMasterService({
    residentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-resident-master-service";
