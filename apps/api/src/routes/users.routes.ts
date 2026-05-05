import { Router } from "express";
import { createUser, listUsers } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const usersRoutes = Router();

usersRoutes.get("/admin/users", requireAuth, requireRole("admin"), asyncHandler(listUsers));
usersRoutes.post("/admin/users", requireAuth, requireRole("admin"), asyncHandler(createUser));
