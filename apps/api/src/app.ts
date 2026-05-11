import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { auditRoutes } from "./routes/audit.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { inquiriesRoutes } from "./routes/inquiries.routes.js";
import { mediaRoutes } from "./routes/media.routes.js";
import { newsRoutes } from "./routes/news.routes.js";
import { postsRoutes } from "./routes/posts.routes.js";
import { resourcesRoutes } from "./routes/resources.routes.js";
import { servicesRoutes } from "./routes/services.routes.js";
import { settingsRoutes } from "./routes/settings.routes.js";
import { usersRoutes } from "./routes/users.routes.js";

const allowedOrigins = env.clientOrigin.split(",").map((origin) => origin.trim());

export const app = express();

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "test" ? "tiny" : "dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", postsRoutes);
app.use("/api", newsRoutes);
app.use("/api", resourcesRoutes);
app.use("/api", servicesRoutes);
app.use("/api", inquiriesRoutes);
app.use("/api", settingsRoutes);
app.use("/api", mediaRoutes);
app.use("/api", usersRoutes);
app.use("/api", auditRoutes);

app.use(errorMiddleware);
