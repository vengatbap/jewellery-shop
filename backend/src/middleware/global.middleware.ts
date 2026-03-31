import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};