import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { CourtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

type Props = {
  courtBookingMasterRepository: CourtBookingMasterRepository;
};

type Input = {
  id?: string;
  isRestore?: boolean | string;
};

export class DeleteCourtBookingMasterService {
  protected _courtBookingMasterRepository: CourtBookingMasterRepository;

  public constructor(props: Props) {
    this._courtBookingMasterRepository = props.courtBookingMasterRepository;
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

    const record = await this._courtBookingMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._courtBookingMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
