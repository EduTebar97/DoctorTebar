import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) return next(new ApiError(401, "Not authenticated"));
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user || user.status !== "active") return next(new ApiError(401, "Invalid user"));
    req.user = user as never;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid token"));
  }
}
