import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ApartmentMasterRepository } from "@/repositories/apartment-master-repository";

type Props = {
  apartmentMasterRepository: ApartmentMasterRepository;
};

type Input = {
  id?: string;
  apartmentId?: string;
  isRestore?: boolean | string;
};

export class DeleteApartmentMasterService {
  protected _apartmentMasterRepository: ApartmentMasterRepository;

  public constructor(props: Props) {
    this._apartmentMasterRepository = props.apartmentMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.apartmentId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._apartmentMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._apartmentMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
