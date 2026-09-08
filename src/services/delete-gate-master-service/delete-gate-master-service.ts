import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { GateMasterRepository } from "@/repositories/gate-master-repository";

type Props = {
  gateMasterRepository: GateMasterRepository;
};

type Input = {
  id?: string;
  gateId?: string;
  isRestore?: boolean | string;
};

export class DeleteGateMasterService {
  protected _gateMasterRepository: GateMasterRepository;

  public constructor(props: Props) {
    this._gateMasterRepository = props.gateMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.gateId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._gateMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._gateMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
