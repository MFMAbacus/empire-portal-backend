import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { AccessCardMasterRepository } from "@/repositories/access-card-master-repository";

type Props = {
  accessCardMasterRepository: AccessCardMasterRepository;
};

type Input = {
  id?: string;
  cardId?: string;
  isRestore?: boolean | string;
};

export class DeleteAccessCardMasterService {
  protected _accessCardMasterRepository: AccessCardMasterRepository;

  public constructor(props: Props) {
    this._accessCardMasterRepository = props.accessCardMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.cardId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._accessCardMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._accessCardMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
