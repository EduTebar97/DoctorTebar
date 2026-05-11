import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { User } from "../models/User.model.js";
import { audit } from "../services/audit.service.js";
import { ApiError } from "../utils/ApiError.js";

export async function listUsers(_req: Request, res: Response) {
  res.json(await User.find().select("-passwordHash").sort({ createdAt: -1 }));
}

export async function createUser(req: Request, res: Response) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, passwordHash });
  await audit(req, "create", "user", String(user._id));
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
}

export async function updateUser(req: Request, res: Response) {
  const { password: _password, passwordHash: _passwordHash, ...payload } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).select("-passwordHash");
  if (!user) throw new ApiError(404, "User not found");
  await audit(req, "update", "user", String(user._id), payload);
  res.json(user);
}

export async function updateUserStatus(req: Request, res: Response) {
  if (String(req.user?._id) === req.params.id && req.body.status === "disabled") {
    throw new ApiError(400, "You cannot disable your own user");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).select("-passwordHash");
  if (!user) throw new ApiError(404, "User not found");
  await audit(req, "update-status", "user", String(user._id), { status: req.body.status });
  res.json(user);
}

export async function resetUserPassword(req: Request, res: Response) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.findByIdAndUpdate(req.params.id, { passwordHash }, { new: true }).select("-passwordHash");
  if (!user) throw new ApiError(404, "User not found");
  await audit(req, "reset-password", "user", String(user._id));
  res.json(user);
}
