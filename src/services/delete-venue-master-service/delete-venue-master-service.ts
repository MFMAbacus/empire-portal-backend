import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { VenueMasterRepository } from "@/repositories/venue-master-repository";

type Props = {
  venueMasterRepository: VenueMasterRepository;
};

type Input = {
  id?: string;
  venueId?: string;
  isRestore?: boolean | string;
};

export class DeleteVenueMasterService {
  protected _venueMasterRepository: VenueMasterRepository;

  public constructor(props: Props) {
    this._venueMasterRepository = props.venueMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.venueId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._venueMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._venueMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
