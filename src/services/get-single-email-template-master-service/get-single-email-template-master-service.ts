import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IEmailTemplateMaster } from "@/schemas/email-template-master-schema";
import { EmailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

type Props = {
  emailTemplateMasterRepository: EmailTemplateMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleEmailTemplateMasterService {
  protected _emailTemplateMasterRepository: EmailTemplateMasterRepository;

  public constructor(props: Props) {
    this._emailTemplateMasterRepository = props.emailTemplateMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IEmailTemplateMaster, Failure>> {
    const emailTemplate = await this._emailTemplateMasterRepository.get(input.id);
    if (!emailTemplate) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (emailTemplate as any).toObject === "function" ? (emailTemplate as any).toObject() : { ...emailTemplate };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
