import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ReservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

type Props = {
  reservationRuleMasterRepository: ReservationRuleMasterRepository;
};

type Input = {
  id?: string;
  isRestore?: boolean | string;
};

export class DeleteReservationRuleMasterService {
  protected _reservationRuleMasterRepository: ReservationRuleMasterRepository;

  public constructor(props: Props) {
    this._reservationRuleMasterRepository = props.reservationRuleMasterRepository;
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

    const record = await this._reservationRuleMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._reservationRuleMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
