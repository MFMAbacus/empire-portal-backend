import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ISecurityCoordinatorMaster } from "@/schemas/security-coordinator-master-schema";
import { SessionRecord } from "@/records/session-record";
import { SecurityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

type Props = {
  securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetSecurityCoordinatorMasterService {
  protected _securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;

  public constructor(props: Props) {
    this._securityCoordinatorMasterRepository = props.securityCoordinatorMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ISecurityCoordinatorMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const coordinators = await this._securityCoordinatorMasterRepository.getAll({ isArchived });

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