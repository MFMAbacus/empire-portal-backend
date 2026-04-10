import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { RequestRecord } from "@/records/request-record";
import { Validation } from "@/utility/validation";

export class RequestModel extends Model {
  public static make(record: RequestRecord): RequestModel {
    const model = new RequestModel(Model._makeAttributes(record));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "type",
      Validation.make(this.get("type"))
        .mandatory()
        .string({
          pattern: /^(general|maintenance|buy)$/,
        })
        .getRule()
    );
    validationBag.set(
      "customerId",
      Validation.make(this.get("customerId")).mandatory().string().getRule()
    );
    validationBag.set(
      "customerCode",
      Validation.make(this.get("customerCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "unitId",
      Validation.make(this.get("unitId")).mandatory().string().getRule()
    );
    validationBag.set(
      "unitName",
      Validation.make(this.get("unitName")).mandatory().string().getRule()
    );
    validationBag.set(
      "categoryId",
      Validation.make(this.get("categoryId")).mandatory().string().getRule()
    );
    validationBag.set(
      "categoryName",
      Validation.make(this.get("categoryName")).mandatory().string().getRule()
    );
    validationBag.set(
      "project",
      Validation.make(this.get("project")).optional().string().getRule()
    );
    // eslint-disable-next-line max-len
    validationBag.set(
      "subCategoryName",
      Validation.make(this.get("subCategoryName")).optional().string().getRule()
    );
    validationBag.set(
      "title",
      Validation.make(this.get("title")).mandatory().string().getRule()
    );
    validationBag.set(
      "description",
      Validation.make(this.get("description")).mandatory().string().getRule()
    );
    validationBag.set(
      "visitDate",
      Validation.make(this.get("visitDate")).mandatory().date().getRule()
    );
    validationBag.set(
      "visitTime",
      Validation.make(this.get("visitTime"))
        .optional()
        .string({
          pattern: /^(none|morning|afternoon)$/,
        })
        .getRule()
    );
    validationBag.set(
      "priority",
      Validation.make(this.get("priority"))
        .mandatory()
        .string({
          pattern: /^(low|medium|high)$/,
        })
        .getRule()
    );
    validationBag.set(
      "totalPrice",
      Validation.make(this.get("totalPrice")).optional().number().getRule()
    );
    validationBag.set(
      "attachments",
      Validation.make(this.get("attachments")).optional().array().getRule()
    );
    validationBag.set(
      "isIntangible",
      Validation.make(this.get("isIntangible")).mandatory().boolean().getRule()
    );

    if (!validationBag.hasError("attachments")) {
      // eslint-disable-next-line max-len
      for (const [index, attachment] of this.get<string[]>(
        "attachments"
      ).entries()) {
        validationBag.set(
          `attachments.${index}`,
          Validation.make(attachment).optional().string().getRule()
        );
      }
    }

    return validationBag;
  }
}
