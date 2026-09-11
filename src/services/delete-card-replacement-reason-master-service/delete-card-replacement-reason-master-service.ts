import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { CardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

type Props = {
  cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;
};

type Input = {
  id?: string;
  reasonId?: string;
  isRestore?: boolean | string;
};

export class DeleteCardReplacementReasonMasterService {
  protected _cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;

  public constructor(props: Props) {
    this._cardReplacementReasonMasterRepository = props.cardReplacementReasonMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.reasonId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();

    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._cardReplacementReasonMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore =
      input.isRestore === true ||
      input.isRestore === "1" ||
      input.isRestore === "true";

    record.isArchived = !isRestore;
    await this._cardReplacementReasonMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}