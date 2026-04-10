import { Model } from "@/utility/model";
import { IWelcomescreenMediaRecord } from "@/schemas/welcomescreen-media-schema";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";

export class WelcomescreenMediaModel extends Model {
  public static make(
    record: Partial<IWelcomescreenMediaRecord>
  ): WelcomescreenMediaModel {
    const filteredRecord: Partial<IWelcomescreenMediaRecord> = {
      title: record.title,
      fileName: record.fileName,
      filePath: record.filePath,
      fileType: record.fileType,
      fileSize: record.fileSize,
      mimeType: record.mimeType,
      isActive: record.isActive,
      displayOrder: record.displayOrder,
    };
    return new WelcomescreenMediaModel(Model._makeAttributes(filteredRecord));
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "title",
      Validation.make(this.get("title")).mandatory().string().getRule()
    );
    validationBag.set(
      "fileName",
      Validation.make(this.get("fileName")).mandatory().string().getRule()
    );
    validationBag.set(
      "filePath",
      Validation.make(this.get("filePath")).mandatory().string().getRule()
    );
    validationBag.set(
      "fileType",
      Validation.make(this.get("fileType")).mandatory().string().getRule()
    );
    validationBag.set(
      "fileSize",
      Validation.make(this.get("fileSize")).mandatory().number().getRule()
    );
    validationBag.set(
      "mimeType",
      Validation.make(this.get("mimeType")).mandatory().string().getRule()
    );
    validationBag.set(
      "isActive",
      Validation.make(this.get("isActive")).mandatory().boolean().getRule()
    );
    validationBag.set(
      "displayOrder",
      Validation.make(this.get("displayOrder")).mandatory().number().getRule()
    );

    return validationBag;
  }
}
