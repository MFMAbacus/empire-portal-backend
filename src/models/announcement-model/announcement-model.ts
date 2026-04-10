import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { IAnnouncement } from "@/schemas/announcements-schema";
import { Validation } from "@/utility/validation";

export class AnnouncementModel extends Model {
  public static make(record: Partial<IAnnouncement>): AnnouncementModel {
    const filteredRecord: Partial<IAnnouncement> = {
      _id: record._id,
      id: record.id,
      title: record.title,
      description: record.description,
      publishDate: record.publishDate,
      expirationDate: record.expirationDate,
      isPublished: record.isPublished,
      group: record.group,
      pts: record.pts,
      pss: record.pss,
      bps: record.bps,
      prs: record.prs,
      bls: record.bls,
      fls: record.fls,
      uns: record.uns,
      attachments: record.attachments,
      isArchived: record.isArchived,
      // __v: record.__v,
    };

    const model = new AnnouncementModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "title",
      Validation.make(this.get("title")).mandatory().string().getRule(),
    );
    validationBag.set(
      "description",
      Validation.make(this.get("description")).mandatory().string().getRule(),
    );
    validationBag.set(
      "publishDate",
      Validation.make(this.get("publishDate")).mandatory().date().getRule(),
    );
    validationBag.set(
      "expirationDate",
      Validation.make(this.get("expirationDate")).optional().date().getRule(),
    );
    validationBag.set(
      "isPublished",
      Validation.make(this.get("isPublished")).mandatory().boolean().getRule(),
    );
    validationBag.set(
      "group",
      Validation.make(this.get("group"))
        .mandatory()
        .string({
          pattern: /^(customers|staff|customers-staff)$/,
        })
        .getRule(),
    );
    validationBag.set(
      "pts",
      Validation.make(this.get("pts")).mandatory().array().getRule(),
    );
    validationBag.set(
      "pss",
      Validation.make(this.get("pss")).mandatory().array().getRule(),
    );
    validationBag.set(
      "bps",
      Validation.make(this.get("bps")).mandatory().array().getRule(),
    );
    validationBag.set(
      "prs",
      Validation.make(this.get("prs")).mandatory().array().getRule(),
    );
    validationBag.set(
      "bls",
      Validation.make(this.get("bls")).mandatory().array().getRule(),
    );
    validationBag.set(
      "fls",
      Validation.make(this.get("fls")).mandatory().array().getRule(),
    );
    validationBag.set(
      "uns",
      Validation.make(this.get("uns")).mandatory().array().getRule(),
    );
    validationBag.set(
      "attachments",
      Validation.make(this.get("attachments")).optional().array().getRule(),
    );

    if (!validationBag.hasError("pts")) {
      for (const [index, pt] of this.get<string[]>("pts").entries()) {
        validationBag.set(
          `pts.${index}`,
          Validation.make(pt).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("pss")) {
      for (const [index, ps] of this.get<string[]>("pss").entries()) {
        validationBag.set(
          `ps.${index}`,
          Validation.make(ps).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("bps")) {
      for (const [index, bp] of this.get<string[]>("bps").entries()) {
        validationBag.set(
          `bps.${index}`,
          Validation.make(bp).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("prs")) {
      for (const [index, pr] of this.get<string[]>("prs").entries()) {
        validationBag.set(
          `prs.${index}`,
          Validation.make(pr).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("bls")) {
      for (const [index, bl] of this.get<string[]>("bls").entries()) {
        validationBag.set(
          `bls.${index}`,
          Validation.make(bl).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("fls")) {
      for (const [index, fl] of this.get<string[]>("fls").entries()) {
        validationBag.set(
          `fls.${index}`,
          Validation.make(fl).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("uns")) {
      for (const [index, un] of this.get<string[]>("uns").entries()) {
        validationBag.set(
          `uns.${index}`,
          Validation.make(un).optional().string().getRule(),
        );
      }
    }

    if (!validationBag.hasError("attachments")) {
      // eslint-disable-next-line max-len
      for (const [index, attachment] of this.get<string[]>(
        "attachments",
      ).entries()) {
        validationBag.set(
          `attachments.${index}`,
          Validation.make(attachment).optional().string().getRule(),
        );
      }
    }

    return validationBag;
  }
}
