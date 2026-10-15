import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetResidentMasterService } from "./get-resident-master-service";
import { getSessionService } from "@/services/get-session-service";
import { residentMasterRepository } from "@/repositories/resident-master-repository";
import { GetMobileResidentMasterService } from "./get-mobile-resident-master-service";
import e from "express";

export const getResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetResidentMasterService({
    residentMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileResidentMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileResidentMasterService(),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-resident-master-service";
export * from "./get-mobile-resident-master-service";