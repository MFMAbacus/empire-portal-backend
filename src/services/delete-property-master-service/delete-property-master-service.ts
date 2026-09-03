import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { PropertyMasterRepository } from "@/repositories/property-master-repository";

type Props = {
  propertyMasterRepository: PropertyMasterRepository;
};

type Input = {
  id?: string;
  propertyId?: string;
  isRestore?: boolean | string;
};

export class DeletePropertyMasterService {
  protected _propertyMasterRepository: PropertyMasterRepository;

  public constructor(props: Props) {
    this._propertyMasterRepository = props.propertyMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.propertyId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._propertyMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._propertyMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
