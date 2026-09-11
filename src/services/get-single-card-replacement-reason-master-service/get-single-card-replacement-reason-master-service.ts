import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICardReplacementReasonMaster } from "@/schemas/card-replacement-reason-master-schema";
import { CardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

type Props = {
  cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCardReplacementReasonMasterService {
  protected _cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;

  public constructor(props: Props) {
    this._cardReplacementReasonMasterRepository = props.cardReplacementReasonMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICardReplacementReasonMaster, Failure>> {
    const property = await this._cardReplacementReasonMasterRepository.get(input.id);
    if (!property) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (property as any).toObject === "function" ? (property as any).toObject() : { ...property };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
