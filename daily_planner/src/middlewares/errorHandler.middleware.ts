import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let status = "Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    status = err.status;
  } else if (err instanceof Error) {
    message = err.message;
  }

  console.error("ERROR ", err);

  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    status,
    message,
    ...(isDev && err instanceof Error && { stack: err.stack }),
  });
};
