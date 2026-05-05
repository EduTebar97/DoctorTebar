import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { User } from "../models/User.model.js";
import { audit } from "../services/audit.service.js";

export async function listUsers(_req: Request, res: Response) {
  res.json(await User.find().select("-passwordHash").sort({ createdAt: -1 }));
}

export async function createUser(req: Request, res: Response) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, passwordHash });
  await audit(req, "create", "user", String(user._id));
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
}
