import fs from "fs";
import busboy from "busboy";
import { Request, Response } from "express";

import { Generator } from "@/utility/generator";

const filePathBase = "storage/uploads/";
const acceptedFileSize = 1024 * 1024 * 10;
const acceptedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/bmp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const uploadHandler = (request: Request, response: Response): void => {
  let status = 201;
  let success = true;
  let code = "success";
  const filePrefix = Generator.shortToken();
  let fileName = "";
  let busBoy: busboy.Busboy;

  try {
    busBoy = busboy({
      headers: request.headers,
      limits: {
        parts: 1,
        fileSize: acceptedFileSize,
      },
    });
  } catch (error: unknown) {
    response.status(400).json({
      success: false,
      code: "bad-request",
    });
    return;
  }

  busBoy.on("file", (name, file, info) => {
    if (name !== "file") {
      status = 400;
      success = false;
      code = "missing-file";
      file.resume();
      return;
    }

    if (!acceptedMimeTypes.includes(info.mimeType)) {
      status = 400;
      success = false;
      code = "unsupported-mime-type";
      file.resume();
      return;
    }

    file.on("limit", () => {
      status = 400;
      success = false;
      code = "file-too-large";
      file.resume();
      return;
    });

    fileName = info.filename;
    const filePath = `${filePathBase}${filePrefix}-${fileName}`;
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);
  });

  busBoy.on("close", function () {
    response.status(status);
    response.json({
      success,
      code,
      data: !success
        ? undefined
        : {
            fileName: `${filePrefix}-${fileName}`,
          },
    });
  });

  request.pipe(busBoy);
};
