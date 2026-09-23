import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GuestAccessRepository } from "@/repositories/guest-access-repository";

// Direct Mongoose models for enrichment lookups
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";
import PropertyMaster from "@/schemas/property-master-schema/property-master-schema";
import VehicleTypeMaster from "@/schemas/vehicle-type-master-schema/vehicle-type-master-schema";
import GateMaster from "@/schemas/gate-master-schema/gate-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import ApprovalRoutingMaster from "@/schemas/approval-routing-master-schema/approval-routing-master-schema";
import SecurityCoordinatorMaster from "@/schemas/security-coordinator-master-schema/security-coordinator-master-schema";

type Props = {
  guestAccessRepository: GuestAccessRepository;
};

export class GetGuestAccessService {
  protected _guestAccessRepository: GuestAccessRepository;

  public constructor(props: Props) {
    this._guestAccessRepository = props.guestAccessRepository;
  }

  public async execute(input: any): Promise<Result<any[], Failure>> {
    try {
      const records = await this._guestAccessRepository.getAll({
        isArchived: input?.isArchived,
        residentId: input?.residentId,
      });

      // Batch-load all referenced lookup tables to avoid N+1 queries
      const [
        allResidents,
        allApartments,
        allProjects,
        allVehicleTypes,
        allGates,
        allStatuses,
        allApprovalRouting,
        allSecurityCoordinators,
      ] = await Promise.all([
        ResidentMaster.find({ isArchived: false }).lean(),
        ApartmentMaster.find({ isArchived: false }).lean(),
        PropertyMaster.find({ isArchived: false }).lean(),
        VehicleTypeMaster.find({ isArchived: false }).lean(),
        GateMaster.find({ isArchived: false }).lean(),
        CommonStatusMaster.find({ module: "Guest Access", isArchived: false }).sort({ sequence: 1 }).lean(),
        ApprovalRoutingMaster.find({ module: "Guest Access", isActive: true, isArchived: false }).lean(),
        SecurityCoordinatorMaster.find({ isActive: true, isArchived: false }).lean(),
      ]);

      // Multi-key lookup maps for 100% ID-to-Name resolution
      const residentMap = new Map();
      allResidents.forEach((r: any) => {
        if (r.id) residentMap.set(r.id, r);
        if (r.residentId) residentMap.set(r.residentId, r);
        if (r._id) residentMap.set(r._id.toString(), r);
      });

      const apartmentMap = new Map();
      allApartments.forEach((a: any) => {
        if (a.id) apartmentMap.set(a.id, a);
        if (a.apartmentId) apartmentMap.set(a.apartmentId, a);
        if (a._id) apartmentMap.set(a._id.toString(), a);
      });

      const projectMap = new Map();
      allProjects.forEach((p: any) => {
        if (p.projectCode) projectMap.set(p.projectCode, p);
        if (p.id) projectMap.set(p.id, p);
        if (p._id) projectMap.set(p._id.toString(), p);
      });

      const vehicleTypeMap = new Map();
      allVehicleTypes.forEach((v: any) => {
        if (v.id) vehicleTypeMap.set(v.id, v);
        if (v.vehicleTypeId) vehicleTypeMap.set(v.vehicleTypeId, v);
        if (v.vehicleType) vehicleTypeMap.set(v.vehicleType, v);
        if (v._id) vehicleTypeMap.set(v._id.toString(), v);
      });

      const gateMap = new Map();
      allGates.forEach((g: any) => {
        if (g.id) gateMap.set(g.id, g);
        if (g.gateId) gateMap.set(g.gateId, g);
        if (g._id) gateMap.set(g._id.toString(), g);
      });

      // Enrich each record
      const enriched = records.map((record: any) => {
        const r = record.toObject ? record.toObject() : record;

        // Resolve resident, apartment, project, vehicle type, gate
        const resident = residentMap.get(r.residentId);
        const apartment = apartmentMap.get(r.apartmentId);
        const project = projectMap.get(r.projectCode);
        const vehicleTypeObj = vehicleTypeMap.get(r.vehicleType);
        const gate = r.assignedGateId ? gateMap.get(r.assignedGateId) : null;

        // Get project-specific gates for the approver to choose from
        const projectGates = allGates
          .filter((g: any) => (g.projectCode === r.projectCode || g.projectId === r.projectCode) && g.isActive)
          .map((g: any) => ({
            id: g.id || g._id.toString(),
            gateId: g.gateId,
            gateName: g.gateName,
            location: g.location,
            projectCode: g.projectCode,
          }));

        // Get approval routing for this project + module
        const approvalRouting = allApprovalRouting
          .filter((ar: any) => ar.projectCode === r.projectCode)
          .map((ar: any) => ({ role: ar.approverRole, level: ar.approvalLevel }));

        // Get security coordinator(s) for this project
        const securityCoordinators = allSecurityCoordinators
          .filter((sc: any) => sc.projectCode === r.projectCode)
          .map((sc: any) => ({ role: sc.coordinatorRole, projectCode: sc.projectCode }));

        // Get status sequence for Guest Access (from Common Status Master)
        const approvalStatusOptions = allStatuses.map((s: any) => ({
          statusCode: s.statusCode,
          statusName: s.statusName,
          sequence: s.sequence,
        }));

        return {
          ...r,
          id: r.id || r._id.toString(),
          _id: r._id ? r._id.toString() : r.id,
          // Enriched name fields
          residentName: resident?.name ?? r.residentId,
          residentEmail: resident?.email ?? null,
          residentMobile: resident?.mobileNo ?? null,
          apartmentNo: apartment?.apartmentNo ?? r.apartmentId,
          apartmentBuilding: apartment?.buildingOrTower ?? null,
          apartmentFloor: apartment?.floor ?? null,
          projectName: project?.projectName ?? r.projectCode,
          vehicleTypeName: vehicleTypeObj?.vehicleType ?? r.vehicleType,
          assignedGateName: gate?.gateName ?? r.assignedGateId ?? null,
          // Approval & Gate context
          availableGates: projectGates,
          approvalRouting,
          securityCoordinators,
          approvalStatusOptions,
        };
      });

      return Result.ok(enriched);
    } catch (error) {
      return Result.fail(Failure.badRequest("Failed to get guest requests"));
    }
  }
}
