import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

export function requireRole(...roles: Array<"admin" | "editor">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(new ApiError(403, "Forbidden"));
    return next();
  };
}
