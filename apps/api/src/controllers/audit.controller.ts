import type { Request, Response } from "express";
import { AuditLog } from "../models/AuditLog.model.js";

export async function listAuditLogs(req: Request, res: Response) {
  const filter: Record<string, unknown> = {};
  if (req.query.entity) filter.entity = req.query.entity;
  if (req.query.action) filter.action = req.query.action;
  const logs = await AuditLog.find(filter).populate("userId", "name email role").sort({ createdAt: -1 }).limit(200);
  res.json(logs);
}
