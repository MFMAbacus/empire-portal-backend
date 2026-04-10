import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error(error);
  response.status(500).json({
    success: false,
    code: "internal-server-error",
  });
};
