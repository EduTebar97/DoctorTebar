import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

async function authenticateRequest(req: Request) {
  const authHeader = req.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : undefined;
  const token = bearerToken || req.cookies?.[env.cookieName];
  logger.info("[AUTH] Ruta protegida solicitada", {
    method: req.method,
    endpoint: req.originalUrl,
    authorizationHeaderPresent: Boolean(authHeader),
    cookiePresent: Boolean(req.cookies?.[env.cookieName]),
    tokenPresent: Boolean(token)
  });
  if (!token) return null;
  const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
  const user = await User.findById(payload.userId).select("-passwordHash");
  if (!user || user.status !== "active") return null;
  logger.info("[AUTH] Acceso permitido", { endpoint: req.originalUrl, userFound: true, role: user.role });
  return { user, userId: payload.userId };
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = await authenticateRequest(req);
    if (auth?.user) req.user = auth.user as never;
    return next();
  } catch (error) {
    logger.warn("auth.optional_invalid_token", {
      path: req.originalUrl,
      method: req.method,
      error: error instanceof Error ? error.message : "unknown"
    });
    return next();
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth?.user) {
      logger.warn("[AUTH] Acceso denegado", { path: req.originalUrl, method: req.method, reason: "missing_or_invalid_token" });
      return next(new ApiError(401, "Not authenticated"));
    }
    req.user = auth.user as never;
    return next();
  } catch (error) {
    logger.warn("auth.invalid_token", {
      path: req.originalUrl,
      method: req.method,
      error: error instanceof Error ? error.message : "unknown"
    });
    return next(new ApiError(401, "Invalid token"));
  }
}
