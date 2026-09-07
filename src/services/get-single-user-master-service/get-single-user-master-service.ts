import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IUserMaster } from "@/schemas/user-master-schema";
import { UserMasterRepository } from "@/repositories/user-master-repository";

type Props = {
  userMasterRepository: UserMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleUserMasterService {
  protected _userMasterRepository: UserMasterRepository;

  public constructor(props: Props) {
    this._userMasterRepository = props.userMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IUserMaster, Failure>> {
    const property = await this._userMasterRepository.get(input.id);
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
