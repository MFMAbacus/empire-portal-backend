import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleAccessCardStaffMasterService } from "./get-single-access-card-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { accessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

export const getSingleAccessCardStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleAccessCardStaffMasterService({
    accessCardStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-access-card-staff-master-service";
