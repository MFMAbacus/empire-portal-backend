import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICommonStatusMaster } from "@/schemas/common-status-master-schema";
import { CommonStatusMasterRepository } from "@/repositories/common-status-master-repository";

type Props = {
  commonStatusMasterRepository: CommonStatusMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCommonStatusMasterService {
  protected _commonStatusMasterRepository: CommonStatusMasterRepository;

  public constructor(props: Props) {
    this._commonStatusMasterRepository = props.commonStatusMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICommonStatusMaster, Failure>> {
    const commonStatus = await this._commonStatusMasterRepository.get(input.id);
    if (!commonStatus) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (commonStatus as any).toObject === "function" ? (commonStatus as any).toObject() : { ...commonStatus };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
