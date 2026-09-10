import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IPropertyManagementApprovalMaster } from "@/schemas/property-management-approval-master-schema";
import { SessionRecord } from "@/records/session-record";
import { PropertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

type Props = {
  propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetPropertyManagementApprovalMasterService {
  protected _propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;

  public constructor(props: Props) {
    this._propertyManagementApprovalMasterRepository = props.propertyManagementApprovalMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IPropertyManagementApprovalMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const coordinators = await this._propertyManagementApprovalMasterRepository.getAll({ isArchived });

    const mappedCoordinators = coordinators.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedCoordinators as any);
  }
}