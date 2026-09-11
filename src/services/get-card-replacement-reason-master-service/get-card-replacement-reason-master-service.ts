import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICardReplacementReasonMaster } from "@/schemas/card-replacement-reason-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

type Props = {
  cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCardReplacementReasonMasterService {
  protected _cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;

  public constructor(props: Props) {
    this._cardReplacementReasonMasterRepository = props.cardReplacementReasonMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICardReplacementReasonMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._cardReplacementReasonMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
