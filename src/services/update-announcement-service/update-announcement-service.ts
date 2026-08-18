import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { AnnouncementModel } from "@/models/announcement-model";
import { AnnouncementRepository } from "@/repositories/announcement-repository";
import { AnnouncementGroup } from "@/records/announcement-record";

type Props = {
  announcementRepository: AnnouncementRepository;
};

type Input = {
  id: string;
  title?: string;
  description?: string;
  publishDate?: string;
  expirationDate?: string | null;
  isPublished?: boolean;
  group: AnnouncementGroup;
  pts?: string[];
  pss?: string[];
  bps?: string[];
  prs?: string[];
  bls?: string[];
  fls?: string[];
  uns?: string[];
  attachments?: string[];
};

export class UpdateAnnouncementService {
  protected _announcementRepository: AnnouncementRepository;

  public constructor(props: Props) {
    this._announcementRepository = props.announcementRepository;
  }

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
    if (
      typeof announcementRecord === "undefined" ||
      announcementRecord.isArchived
    ) {
      return Result.fail(Failure.notFound());
    }

    const announcementModel = AnnouncementModel.make(announcementRecord);

    announcementModel.set("title", input.title);
    announcementModel.set("description", input.description);
    announcementModel.set("publishDate", input.publishDate);
    announcementModel.set("expirationDate", input.expirationDate);
    announcementModel.set("isPublished", input.isPublished);
    announcementModel.set("group", input.group);
    announcementModel.set("pts", input.pts);
    announcementModel.set("pss", input.pss);
    announcementModel.set("bps", input.bps);
    announcementModel.set("prs", input.prs);
    announcementModel.set("bls", input.bls);
    announcementModel.set("fls", input.fls);
    announcementModel.set("uns", input.uns);
    announcementModel.set("attachments", input.attachments);

    const validationBag = announcementModel.validate();

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._announcementRepository.Update(announcementModel.getRecord());

    return Result.ok(announcementModel.get("id"));
  }
}
