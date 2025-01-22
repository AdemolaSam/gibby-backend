import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const status: number = err.status || 500;
  const message: string = err.message || "Internal Server Error";

  // if (err instanceof mongoose.Error) {
  //   console.log("INSTACE OOOOOOOOO");
  //   return res.status(400).json({
  //     success: false,
  //     error: message,
  //     path: req.originalUrl,
  //     timeStamp: new Date().toISOString(),
  //   });
  // }
  console.log(`[Error]: ${status}: ${message}`);
  return res.status(status).json({
    success: false,
    error: message,
    path: req.originalUrl,
    timeStamp: new Date().toISOString(),
  });
};

export class AuthError extends Error {
  status: number;
  constructor(message?: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.message = "....UNAUTHORIZED!!!...";
  }
}
