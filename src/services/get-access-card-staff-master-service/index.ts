import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetAccessCardStaffMasterService } from "./get-access-card-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

export const getAccessCardStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetAccessCardStaffMasterService({
    accessCardStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-access-card-staff-master-service";
