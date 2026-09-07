import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IEmailTemplateMaster } from "@/schemas/email-template-master-schema";
import { SessionRecord } from "@/records/session-record";
import { EmailTemplateMasterRepository } from "@/repositories/email-template-master-repository";

type Props = {
  emailTemplateMasterRepository: EmailTemplateMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetEmailTemplateMasterService {
  protected _emailTemplateMasterRepository: EmailTemplateMasterRepository;

  public constructor(props: Props) {
    this._emailTemplateMasterRepository = props.emailTemplateMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IEmailTemplateMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._emailTemplateMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
