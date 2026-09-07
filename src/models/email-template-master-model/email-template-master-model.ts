import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IEmailTemplateMaster } from "@/schemas/email-template-master-schema";

export class EmailTemplateMasterModel extends Model {
  public static make(record: Partial<IEmailTemplateMaster>): EmailTemplateMasterModel {
    const filteredRecord: Partial<IEmailTemplateMaster> = {
      _id: record._id,
      id: record.id,
      templateCode: record.templateCode,
      module: record.module,
      event: record.event,
      subject: record.subject,
      body: record.body,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new EmailTemplateMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "templateCode",
      Validation.make(this.get("templateCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "module",
      Validation.make(this.get("module")).mandatory().string().getRule()
    );
    validationBag.set(
      "event",
      Validation.make(this.get("event")).mandatory().string().getRule()
    );
    validationBag.set(
      "subject",
      Validation.make(this.get("subject")).mandatory().string().getRule()
    );
    validationBag.set(
      "body",
      Validation.make(this.get("body")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
