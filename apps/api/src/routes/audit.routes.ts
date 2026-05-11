import { Router } from "express";
import { listAuditLogs } from "../controllers/audit.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auditRoutes = Router();

auditRoutes.get("/admin/audit", requireAuth, requireRole("admin"), asyncHandler(listAuditLogs));
