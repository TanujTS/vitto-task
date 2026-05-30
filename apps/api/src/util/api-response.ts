import type { Request, Response } from "express";
import type { ApiResponseData, Meta } from "../types/index.js";

// 2xx helpers
export const responseOk = <T>(req: Request, res: Response, data: T, message = "OK", meta?: Meta) => {
  return res.status(200).json({ status: "success", message, data, meta } satisfies ApiResponseData<T>);
}

export const responseCreated = <T>(req: Request, res: Response, data: T, message = "Created", meta?: Meta) => {
  return res.status(201).json({ status: "success", message, data, meta } satisfies ApiResponseData<T>);
}

// error helper
export const responseFail = (
  req: Request,
  res: Response,
  code: number,
  message: string,
  details?: unknown,
  meta?: Meta,
  stack?: string
) => {

  return res.status(code).json({
    status: "error",
    message,
    error: { message, code: code, details, ...(stack ? { stack } : {}) },
    meta,
  } satisfies ApiResponseData<never>);

}