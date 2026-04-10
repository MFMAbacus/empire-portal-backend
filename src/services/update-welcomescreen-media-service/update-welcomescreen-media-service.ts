import fs from "fs";
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";

import { WelcomescreenMediaRepository } from "@/repositories/welcomescreen-media-repository";

type Props = {
  welcomescreenMediaRepository: WelcomescreenMediaRepository;
};

type Input = {
  _id: string;
  title: string;
  fileName: string;
  isActive: boolean;
};

export class UpdateWelcomescreenMediaService {
  protected _welcomescreenMediaRepository: WelcomescreenMediaRepository;

  public constructor(props: Props) {
    this._welcomescreenMediaRepository = props.welcomescreenMediaRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const existingMedia = await this._welcomescreenMediaRepository.get(
      input._id
    );

    if (!existingMedia) {
      return Result.fail(Failure.notFound());
    }

    const updateData: any = {};

    if (input.title !== undefined) {
      existingMedia.title = input.title;
    }

    existingMedia.isActive = input.isActive;

    if (input.fileName !== existingMedia.fileName) {
      const filePath = `storage/uploads/${input.fileName}`;

      if (!fs.existsSync(filePath)) {
        return Result.fail(Failure.badRequest("file-not-found"));
      }

      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      const fileName = `${input.fileName}`;

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

      existingMedia.fileName = fileName;
      existingMedia.filePath = filePath;
      existingMedia.fileType = fileType;
      existingMedia.fileSize = fileSize;
      existingMedia.mimeType = mimeType;
    }

    existingMedia.save();

    return Result.ok(input._id);
  }
}
