import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IGuardAccountMappingMaster } from "@/schemas/guard-account-mapping-master-schema";
import { GuardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

type Props = {
  guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleGuardAccountMappingMasterService {
  protected _guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;

  public constructor(props: Props) {
    this._guardAccountMappingMasterRepository = props.guardAccountMappingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IGuardAccountMappingMaster, Failure>> {
    const property = await this._guardAccountMappingMasterRepository.get(input.id);
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
