import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";

export function errorMiddleware(error: any, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) logger.error(error);
  res.status(statusCode).json({
    message: error.message || "Internal server error",
    details: error.details || undefined
  });
}
