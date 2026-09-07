import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { EmailTemplateMasterModel } from "@/models/email-template-master-model";
import { EmailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

type Props = {
  emailTemplateMasterRepository: EmailTemplateMasterRepository;
};

type Input = {
  id?: string;
  templateId?: string;
  templateCode: string;
  module: string;
  event: string;
  subject: string;
  body: string;
  isActive?: boolean;
};

export class CreateEmailTemplateMasterService {
  protected _emailTemplateMasterRepository: EmailTemplateMasterRepository;

  public constructor(props: Props) {
    this._emailTemplateMasterRepository = props.emailTemplateMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const targetId = input.templateId || input.id;

    if (targetId) {
      const existing = await this._emailTemplateMasterRepository.get(targetId);
      if (existing) {
        existing.templateCode = input.templateCode || existing.templateCode;
        existing.module = input.module || existing.module;
        existing.event = input.event || existing.event;
        existing.subject = input.subject || existing.subject;
        existing.body = input.body || existing.body;
        existing.isActive = isActive;
        await this._emailTemplateMasterRepository.Update(existing);
        return Result.ok(targetId);
      }
    }

    const emailTemplateModel = EmailTemplateMasterModel.make({
      id: targetId || Generator.id("EM"),
      templateCode: input.templateCode,
      module: input.module,
      event: input.event,
      subject: input.subject,
      body: input.body,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = emailTemplateModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = emailTemplateModel.getRecord();
    await this._emailTemplateMasterRepository.Create(record as any);

    return Result.ok(emailTemplateModel.get("id"));
  }
}
