import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../util/api-error";
import { responseFail } from "../util/api-response";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return responseFail(
      req, 
      res,
      err.code,
      err.message,
      err.errors,
      undefined,
      process.env.NODE_ENV === "development" ? err.stack : undefined
    );
  }
  return responseFail(req, res, 500, "Internal server error");
}