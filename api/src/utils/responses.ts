import type { Response } from "express";

interface IResponse {
  res: Response;
  status?: number;
  data?: any;
  message?: any;
}

export function success({ res, status = 200, data, message }: IResponse): Response {
  return res.status(status).json({
    ok: true,
    data,
    message,
  });
}

export function failure({ res, status = 500, message }: IResponse): Response {
  return res.status(status).json({
    ok: false,
    message: message instanceof Error ? message.message : message
  });
}