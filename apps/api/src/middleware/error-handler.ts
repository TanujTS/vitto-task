import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../util/api-error";
import { responseFail } from "../util/api-response";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const trace = err instanceof Error ? err.stack : String(err);

  if (err instanceof ApiError) {
    console.error(`[${req.method}] ${req.originalUrl} ${err.code} - ${err.message}\n${trace}`);

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

  console.error(`[${req.method}] ${req.originalUrl} 500 - Internal server error\n${trace}`);

  return responseFail(req, res, 500, "Internal server error");
}
