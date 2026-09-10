import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IPropertyManagementApprovalMaster } from "@/schemas/property-management-approval-master-schema";
import { PropertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

type Props = {
  propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;
};

type Input = {
  id: string;
};

export class GetSinglePropertyManagementApprovalMasterService {
  protected _propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;

  public constructor(props: Props) {
    this._propertyManagementApprovalMasterRepository = props.propertyManagementApprovalMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IPropertyManagementApprovalMaster, Failure>> {
    const record = await this._propertyManagementApprovalMasterRepository.get(input.id);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (record as any).toObject === "function" ? (record as any).toObject() : { ...record };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}