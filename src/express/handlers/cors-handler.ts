import { Request, Response, NextFunction } from "express";

export const corsHandler = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,POST,PATCH,DELETE,PUT"
  );
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
};
