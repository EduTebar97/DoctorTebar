import type { Request } from "express";
import { AuditLog } from "../models/AuditLog.model.js";

export async function audit(req: Request, action: string, entity: string, entityId?: string, metadata?: Record<string, unknown>) {
  await AuditLog.create({
    userId: req.user?._id,
    action,
    entity,
    entityId,
    metadata,
    ip: req.ip,
    userAgent: req.get("user-agent")
  });
}
