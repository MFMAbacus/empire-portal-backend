import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IResidentMaster } from "@/schemas/resident-master-schema";
import { ResidentMasterRepository } from "@/repositories/resident-master-repository";

type Props = {
  residentMasterRepository: ResidentMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleResidentMasterService {
  protected _residentMasterRepository: ResidentMasterRepository;

  public constructor(props: Props) {
    this._residentMasterRepository = props.residentMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IResidentMaster, Failure>> {
    const property = await this._residentMasterRepository.get(input.id);
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
