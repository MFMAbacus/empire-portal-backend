import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CommonStatusMasterRepository } from "@/repositories/common-status-master-repository";

type Props = {
  commonStatusMasterRepository: CommonStatusMasterRepository;
};

type Input = {
  id?: string;
  statusId?: string;
  statusCode?: string;
  module?: string;
  statusName?: string;
  sequence?: number;
  isActive?: boolean;
};

export class UpdateCommonStatusMasterService {
  protected _commonStatusMasterRepository: CommonStatusMasterRepository;

  public constructor(props: Props) {
    this._commonStatusMasterRepository = props.commonStatusMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.statusId || "";
    const record = await this._commonStatusMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    if (input.statusCode) record.statusCode = input.statusCode;
    if (input.module) record.module = input.module;
    if (input.statusName) record.statusName = input.statusName;
    if (input.sequence) record.sequence = input.sequence;
    if (typeof input.isActive !== "undefined") {
      record.isActive = Boolean(input.isActive);
    }

    await this._commonStatusMasterRepository.Update(record);
    return Result.ok(targetId);
  }
}
