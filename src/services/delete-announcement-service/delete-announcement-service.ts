import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { AnnouncementRepository } from "@/repositories/announcement-repository";

type Props = {
  announcementRepository: AnnouncementRepository;
};

type Input = {
  id: string;
  isRestore?: boolean;
};

export class DeleteAnnouncementService {
  protected _announcementRepository: AnnouncementRepository;

  public constructor(props: Props) {
    this._announcementRepository = props.announcementRepository;
  }

  // eslint-disable-next-line max-len
  public async execute(input: Input): Promise<Result<string, Failure>> {
    const id = Attribute.make(input.id);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const announcementRecord = await this._announcementRepository.get(id.get());
    if (typeof announcementRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    announcementRecord.isArchived = !input.isRestore;
    await this._announcementRepository.Update(announcementRecord);

    return Result.ok(id.get());
  }
}
