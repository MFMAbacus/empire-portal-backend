import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IAccessCardMaster } from "@/schemas/access-card-master-schema";
import { AccessCardMasterRepository } from "@/repositories/access-card-master-repository";

type Props = {
  accessCardMasterRepository: AccessCardMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleAccessCardMasterService {
  protected _accessCardMasterRepository: AccessCardMasterRepository;

  public constructor(props: Props) {
    this._accessCardMasterRepository = props.accessCardMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IAccessCardMaster, Failure>> {
    const property = await this._accessCardMasterRepository.get(input.id);
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
