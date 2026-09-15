import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { VenueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

type Props = {
  venueOperatingMasterRepository: VenueOperatingMasterRepository;
};

type Input = {
  id?: string;
  isRestore?: boolean | string;
};

export class DeleteVenueOperatingMasterService {
  protected _venueOperatingMasterRepository: VenueOperatingMasterRepository;

  public constructor(props: Props) {
    this._venueOperatingMasterRepository = props.venueOperatingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._venueOperatingMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._venueOperatingMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
