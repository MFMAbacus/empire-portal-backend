import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { ICardProcessingMaster } from "@/schemas/card-processing-master-schema";

type Props = {
  cardProcessingMasterRepository: CardProcessingMasterRepository;
};

export class GetSingleCardProcessingMasterService {
  protected _cardProcessingMasterRepository: CardProcessingMasterRepository;

  public constructor(props: Props) {
    this._cardProcessingMasterRepository = props.cardProcessingMasterRepository;
  }

  public async execute(id: string): Promise<Result<ICardProcessingMaster, Failure>> {
    try {
      const record = await this._cardProcessingMasterRepository.get(id);
      if (!record) {
        return Result.fail(Failure.notFound());
      }
      return Result.ok(record);
    } catch (error) {
      console.error("Error fetching single card processing request:", error);
      return Result.fail(Failure.badRequest("Failed to fetch card processing request"));
    }
  }
}
