import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { ITaskRecord } from "@/schemas/tasks-schema";
import { ISubTaskRecord } from "@/schemas/tasks-schema";
import { Validation } from "@/utility/validation";

export class TaskModel extends Model {
  public static make(record: Partial<ITaskRecord>): TaskModel {
    const model = new TaskModel(Model._makeAttributes(record));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "categoryId",
      Validation.make(this.get("categoryId")).mandatory().string().getRule()
    );
    validationBag.set(
      "categoryName",
      Validation.make(this.get("categoryName")).mandatory().string().getRule()
    );
    validationBag.set(
      "customerId",
      Validation.make(this.get("customerId")).optional().string().getRule()
    );
    validationBag.set(
      "projectId",
      Validation.make(this.get("projectId")).optional().string().getRule()
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
      Validation.make(this.get("visitTime")).optional().time().getRule()
    );
    validationBag.set(
      "priority",
      Validation.make(this.get("priority"))
        .mandatory()
        .string({
          pattern: /^(low|medium|high|urgent)$/,
        })
        .getRule()
    );
    validationBag.set(
      "dueDate",
      Validation.make(this.get("dueDate")).mandatory().date().getRule()
    );
    validationBag.set(
      "attachments",
      Validation.make(this.get("attachments")).optional().array().getRule()
    );
    validationBag.set(
      "bls",
      Validation.make(this.get("bls")).mandatory().array().getRule()
    );
    validationBag.set(
      "fls",
      Validation.make(this.get("fls")).mandatory().array().getRule()
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

    if (!validationBag.hasError("bls")) {
      for (const [index, bl] of this.get<string[]>("bls").entries()) {
        validationBag.set(
          `bls.${index}`,
          Validation.make(bl).optional().string().getRule()
        );
      }
    }

    if (!validationBag.hasError("fls")) {
      for (const [index, fl] of this.get<string[]>("fls").entries()) {
        validationBag.set(
          `fls.${index}`,
          Validation.make(fl).optional().string().getRule()
        );
      }
    }

    return validationBag;
  }
}

export class SubTaskModel extends Model {
  public static make(record: Partial<ISubTaskRecord>): SubTaskModel {
    const model = new SubTaskModel(Model._makeAttributes(record));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "title",
      Validation.make(this.get("title")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
