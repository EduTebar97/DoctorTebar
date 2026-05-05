import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.model.js";
import { audit } from "../services/audit.service.js";
import { ApiError } from "../utils/ApiError.js";

function publicUser(user: any) {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.status !== "active") throw new ApiError(401, "Invalid credentials");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");
  const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  user.lastLoginAt = new Date();
  await user.save();
  req.user = user as never;
  await audit(req, "login", "auth", String(user._id));
  res.json({ user: publicUser(user) });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(env.cookieName);
  await audit(req, "logout", "auth", req.user ? String(req.user._id) : undefined);
  res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  res.json({ user: req.user ? publicUser(req.user) : null });
}

export async function changePassword(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  await audit(req, "change-password", "auth", String(user._id));
  res.json({ ok: true });
}
