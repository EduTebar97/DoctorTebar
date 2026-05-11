import { Router } from "express";
import { createUser, listUsers, resetUserPassword, updateUser, updateUserStatus } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const usersRoutes = Router();

usersRoutes.get("/admin/users", requireAuth, requireRole("admin"), asyncHandler(listUsers));
usersRoutes.post("/admin/users", requireAuth, requireRole("admin"), asyncHandler(createUser));
usersRoutes.put("/admin/users/:id", requireAuth, requireRole("admin"), asyncHandler(updateUser));
usersRoutes.patch("/admin/users/:id/status", requireAuth, requireRole("admin"), asyncHandler(updateUserStatus));
usersRoutes.patch("/admin/users/:id/password", requireAuth, requireRole("admin"), asyncHandler(resetUserPassword));
