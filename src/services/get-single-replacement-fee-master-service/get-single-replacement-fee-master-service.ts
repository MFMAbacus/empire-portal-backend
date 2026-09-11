import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IReplacementFeeMaster } from "@/schemas/replacement-fee-master-schema";
import { ReplacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

type Props = {
  replacementFeeMasterRepository: ReplacementFeeMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleReplacementFeeMasterService {
  protected _replacementFeeMasterRepository: ReplacementFeeMasterRepository;

  public constructor(props: Props) {
    this._replacementFeeMasterRepository = props.replacementFeeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IReplacementFeeMaster, Failure>> {
    const property = await this._replacementFeeMasterRepository.get(input.id);
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
