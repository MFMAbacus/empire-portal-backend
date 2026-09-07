import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { EmailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

type Props = {
  emailTemplateMasterRepository: EmailTemplateMasterRepository;
};

type Input = {
  id?: string;
  templateId?: string;
  isRestore?: boolean | string;
};

export class DeleteEmailTemplateMasterService {
  protected _emailTemplateMasterRepository: EmailTemplateMasterRepository;

  public constructor(props: Props) {
    this._emailTemplateMasterRepository = props.emailTemplateMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.templateId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._emailTemplateMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._emailTemplateMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
