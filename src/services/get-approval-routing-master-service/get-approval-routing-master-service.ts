import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IApprovalRoutingMaster } from "@/schemas/approval-routing-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ApprovalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

type Props = {
  approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetApprovalRoutingMasterService {
  protected _approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;

  public constructor(props: Props) {
    this._approvalRoutingMasterRepository = props.approvalRoutingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IApprovalRoutingMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._approvalRoutingMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
