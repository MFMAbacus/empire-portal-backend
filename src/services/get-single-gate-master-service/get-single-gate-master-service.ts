import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IGateMaster } from "@/schemas/gate-master-schema";
import { GateMasterRepository } from "@/repositories/gate-master-repository";

type Props = {
  gateMasterRepository: GateMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleGateMasterService {
  protected _gateMasterRepository: GateMasterRepository;

  public constructor(props: Props) {
    this._gateMasterRepository = props.gateMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IGateMaster, Failure>> {
    const property = await this._gateMasterRepository.get(input.id);
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
