import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ISecurityCoordinatorMaster } from "@/schemas/security-coordinator-master-schema";
import { SecurityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

type Props = {
  securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleSecurityCoordinatorMasterService {
  protected _securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;

  public constructor(props: Props) {
    this._securityCoordinatorMasterRepository = props.securityCoordinatorMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ISecurityCoordinatorMaster, Failure>> {
    const record = await this._securityCoordinatorMasterRepository.get(input.id);
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