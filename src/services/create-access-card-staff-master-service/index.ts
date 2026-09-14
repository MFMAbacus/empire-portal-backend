import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateAccessCardStaffMasterService } from "./create-access-card-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

export const createAccessCardStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateAccessCardStaffMasterService({
    accessCardStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-access-card-staff-master-service";
