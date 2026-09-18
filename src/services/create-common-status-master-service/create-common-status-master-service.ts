import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CommonStatusMasterModel } from "@/models/common-status-master-model";
import { CommonStatusMasterRepository } from "@/repositories/common-status-master-repository";

type Props = {
  commonStatusMasterRepository: CommonStatusMasterRepository;
};

type Input = {
  id?: string;
  statusId?: string;
  statusCode: string;
  module: string;
  statusName: string;
  sequence: number;
  isActive?: boolean;
};

export class CreateCommonStatusMasterService {
  protected _commonStatusMasterRepository: CommonStatusMasterRepository;

  public constructor(props: Props) {
    this._commonStatusMasterRepository = props.commonStatusMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const targetId = input.statusId || input.id;

    if (targetId) {
      const existing = await this._commonStatusMasterRepository.get(targetId);
      if (existing) {
        existing.statusCode = input.statusCode || existing.statusCode;
        existing.module = input.module || existing.module;
        existing.statusName = input.statusName || existing.statusName;
        existing.sequence = input.sequence || existing.sequence;
        existing.isActive = isActive;
        await this._commonStatusMasterRepository.Update(existing);
        return Result.ok(targetId);
      }
    }

    const commonStatusModel = CommonStatusMasterModel.make({
      id: targetId || Generator.id("CS"),
      statusCode: input.statusCode,
      module: input.module,
      statusName: input.statusName,
      sequence: input.sequence,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = commonStatusModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = commonStatusModel.getRecord();
    await this._commonStatusMasterRepository.Create(record as any);

    return Result.ok(commonStatusModel.get("id"));
  }
}
