import { Router } from "express";
import { changePassword, login, logout, me, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { loginRateLimit } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { changePasswordSchema, loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post("/login", loginRateLimit, validate(loginSchema), asyncHandler(login));
authRoutes.post("/register", loginRateLimit, validate(registerSchema), asyncHandler(register));
authRoutes.post("/logout", requireAuth, asyncHandler(logout));
authRoutes.get("/me", requireAuth, asyncHandler(me));
authRoutes.post("/change-password", requireAuth, validate(changePasswordSchema), asyncHandler(changePassword));
