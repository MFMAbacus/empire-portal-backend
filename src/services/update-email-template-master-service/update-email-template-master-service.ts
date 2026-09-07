import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { EmailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

type Props = {
  emailTemplateMasterRepository: EmailTemplateMasterRepository;
};

type Input = {
  id?: string;
  templateId?: string;
  templateCode?: string;
  module?: string;
  event?: string;
  subject?: string;
  body?: string;
  isActive?: boolean;
};

export class UpdateEmailTemplateMasterService {
  protected _emailTemplateMasterRepository: EmailTemplateMasterRepository;

  public constructor(props: Props) {
    this._emailTemplateMasterRepository = props.emailTemplateMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.templateId || "";
    const record = await this._emailTemplateMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    if (input.templateCode) record.templateCode = input.templateCode;
    if (input.module) record.module = input.module;
    if (input.event) record.event = input.event;
    if (input.subject) record.subject = input.subject;
    if (input.body) record.body = input.body;
    if (typeof input.isActive !== "undefined") {
      record.isActive = Boolean(input.isActive);
    }

    await this._emailTemplateMasterRepository.Update(record);
    return Result.ok(targetId);
  }
}
