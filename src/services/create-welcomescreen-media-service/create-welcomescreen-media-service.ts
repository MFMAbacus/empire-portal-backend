import fs from "fs";
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";

import { WelcomescreenMediaModel } from "@/models/welcomescreen-media-model";
import { WelcomescreenMediaRepository } from "@/repositories/welcomescreen-media-repository";

type Props = {
  welcomescreenMediaRepository: WelcomescreenMediaRepository;
};

type Input = {
  title: string;
  fileName: string;
  isActive: boolean;
};

export class CreateWelcomescreenMediaService {
  protected _welcomescreenMediaRepository: WelcomescreenMediaRepository;

  public constructor(props: Props) {
    this._welcomescreenMediaRepository = props.welcomescreenMediaRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const filePath = `storage/uploads/${input.fileName}`;

    if (!fs.existsSync(filePath)) {
      return Result.fail(Failure.badRequest("file-not-found"));
    }

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    const fileExtension = input.fileName.toLowerCase().split(".").pop();
    let mimeType = "";
    let fileType = "";

    switch (fileExtension) {
      case "png":
        mimeType = "image/png";
        fileType = "image";
        break;
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
        fileType = "image";
        break;
      case "gif":
        mimeType = "image/gif";
        fileType = "gif";
        break;
      default:
        return Result.fail(Failure.badRequest("unsupported-file-type"));
    }

    const welcomescreenMediaModel = WelcomescreenMediaModel.make({
      title: input.title,
      fileName: input.fileName,
      filePath: filePath,
      fileType: fileType,
      fileSize: fileSize,
      mimeType: mimeType,
      isActive: input.isActive,
      displayOrder: 0,
    });

    const validationBag = welcomescreenMediaModel.validate();

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._welcomescreenMediaRepository.Create(
      welcomescreenMediaModel.getRecord()
    );

    return Result.ok(undefined);
  }
}
