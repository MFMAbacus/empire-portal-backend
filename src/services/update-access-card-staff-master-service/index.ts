import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateAccessCardStaffMasterService } from "./update-access-card-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

export const updateAccessCardStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateAccessCardStaffMasterService({
    accessCardStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-access-card-staff-master-service";
