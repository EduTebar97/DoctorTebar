import { Router } from "express";
import { logger } from "../config/logger.js";
import { TrainingChatMessage } from "../models/TrainingChatMessage.model.js";
import { TrainingCourse } from "../models/TrainingCourse.model.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";
import { inquiryRateLimit } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { idParamSchema, slugParamSchema, trainingChatMessageSchema, trainingCourseSchema } from "../schemas/content.schema.js";
import { audit } from "../services/audit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";

export const trainingRoutes = Router();

async function uniqueTrainingSlug(title: string, currentId?: string) {
  const base = slugify(title);
  const existing = await TrainingCourse.findOne({ slug: base, ...(currentId ? { _id: { $ne: currentId } } : {}) });
  return existing ? `${base}-${Date.now()}` : base;
}

trainingRoutes.get("/training", asyncHandler(async (_req, res) => {
  const items = await TrainingCourse.find({ status: "published" })
    .select("-description")
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 });
  res.json(items);
}));

trainingRoutes.get("/training/:slug", optionalAuth, validate(slugParamSchema), asyncHandler(async (req, res) => {
  const item = await TrainingCourse.findOne({ slug: req.params.slug, status: "published" });
  if (!item) throw new ApiError(404, "Training course not found");
  if (!req.user) {
    logger.info("[FORMACION] Usuario no autenticado intenta acceder a contenido completo", { slug: req.params.slug });
    const publicItem: any = item.toObject();
    publicItem.topics = (publicItem.topics ?? []).map((topic: any) => ({
      _id: topic._id,
      title: topic.title,
      summary: topic.summary,
      order: topic.order,
      imageUrls: [],
      content: "",
      videoUrl: ""
    }));
    return res.json({ ...publicItem, locked: true });
  }
  logger.info("[FORMACION] Usuario autenticado accede a contenido completo", { slug: req.params.slug, userId: String(req.user._id) });
  res.json(item);
}));

trainingRoutes.post("/training/:slug/chat", requireAuth, inquiryRateLimit, validate(trainingChatMessageSchema), asyncHandler(async (req, res) => {
  const course = await TrainingCourse.findOne({ slug: req.params.slug, status: "published" });
  if (!course) throw new ApiError(404, "Training course not found");
  const { consent: _consent, ...payload } = req.body;
  const topic = payload.topicId ? course.topics.id(payload.topicId) : undefined;
  logger.info("[CHAT] Mensaje recibido", {
    courseSlug: course.slug,
    topicId: payload.topicId || null,
    userId: String(req.user!._id)
  });
  const message = await TrainingChatMessage.create({
    message: payload.message,
    courseId: course._id,
    userId: req.user!._id,
    courseTitle: course.title,
    courseSlug: course.slug,
    topicId: payload.topicId || undefined,
    topicTitle: topic?.title,
    name: req.user!.name,
    email: req.user!.email,
    ip: req.ip,
    userAgent: req.get("user-agent")
  });
  logger.info("[CHAT] Mensaje guardado", { id: String(message._id), courseSlug: course.slug });
  res.status(201).json(message);
}));

trainingRoutes.get("/admin/training", requireAuth, asyncHandler(async (_req, res) => {
  const items = await TrainingCourse.find().sort({ updatedAt: -1 });
  res.json(items);
}));

trainingRoutes.get("/admin/training/:id", requireAuth, validate(idParamSchema), asyncHandler(async (req, res) => {
  const item = await TrainingCourse.findById(req.params.id);
  if (!item) throw new ApiError(404, "Training course not found");
  res.json(item);
}));

trainingRoutes.post("/admin/training", requireAuth, validate(trainingCourseSchema), asyncHandler(async (req, res) => {
  const payload = { ...req.body, slug: await uniqueTrainingSlug(req.body.title) };
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
  const item = await TrainingCourse.create(payload);
  await audit(req, "create", "training", String(item._id));
  res.status(201).json(item);
}));

trainingRoutes.put("/admin/training/:id", requireAuth, validate(trainingCourseSchema.merge(idParamSchema)), asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  const payload = { ...req.body, slug: await uniqueTrainingSlug(req.body.title, id) };
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
  const item = await TrainingCourse.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Training course not found");
  await audit(req, "update", "training", String(item._id));
  res.json(item);
}));

trainingRoutes.delete("/admin/training/:id", requireAuth, validate(idParamSchema), asyncHandler(async (req, res) => {
  const item = await TrainingCourse.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Training course not found");
  await audit(req, "delete", "training", String(item._id));
  res.status(204).send();
}));

// ── Admin chat endpoints ──────────────────────────────────────────────────────

trainingRoutes.get("/admin/chat", requireAuth, asyncHandler(async (req, res) => {
  const { course, user, topic, status } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (course) filter.courseSlug = course;
  if (user) filter.$or = [
    { name: { $regex: user, $options: "i" } },
    { email: { $regex: user, $options: "i" } }
  ];
  if (topic) filter.topicTitle = { $regex: topic, $options: "i" };
  if (status) filter.status = status;
  logger.info("[CHAT ADMIN] Consultando conversaciones", { course, user, topic, status });
  const messages = await TrainingChatMessage.find(filter).sort({ createdAt: -1 }).limit(200);
  logger.info("[CHAT ADMIN] Conversaciones devueltas", { count: messages.length });
  res.json(messages);
}));

trainingRoutes.get("/admin/chat/metrics", requireAuth, asyncHandler(async (_req, res) => {
  logger.info("[CHAT ADMIN] Consultando métricas globales");

  const [totals, byFormationRaw, byUserRaw] = await Promise.all([
    TrainingChatMessage.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } }
        }
      }
    ]),
    TrainingChatMessage.aggregate([
      {
        $group: {
          _id: "$courseSlug",
          courseTitle: { $first: "$courseTitle" },
          courseSlug: { $first: "$courseSlug" },
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          distinctUsers: { $addToSet: "$userId" }
        }
      },
      { $addFields: { distinctUserCount: { $size: "$distinctUsers" } } },
      { $project: { distinctUsers: 0 } },
      { $sort: { total: -1 } }
    ]),
    TrainingChatMessage.aggregate([
      {
        $group: {
          _id: { userId: "$userId", courseSlug: "$courseSlug" },
          userId: { $first: "$userId" },
          name: { $first: "$name" },
          email: { $first: "$email" },
          courseTitle: { $first: "$courseTitle" },
          courseSlug: { $first: "$courseSlug" },
          count: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          lastActivity: { $max: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$name" },
          email: { $first: "$email" },
          totalMessages: { $sum: "$count" },
          openMessages: { $sum: "$open" },
          distinctCourses: { $sum: 1 },
          lastActivity: { $max: "$lastActivity" },
          courses: {
            $push: { title: "$courseTitle", slug: "$courseSlug", count: "$count" }
          }
        }
      },
      { $sort: { totalMessages: -1 } }
    ])
  ]);

  const total = totals[0]?.total ?? 0;
  const open = totals[0]?.open ?? 0;
  const usersWithMultipleCourses = byUserRaw.filter((u: { distinctCourses: number }) => u.distinctCourses > 1).length;

  logger.info("[CHAT ADMIN] Métricas calculadas", { total, open, formations: byFormationRaw.length, users: byUserRaw.length });

  res.json({
    total,
    open,
    byFormation: byFormationRaw,
    byUser: byUserRaw,
    usersWithMultipleCourses
  });
}));

trainingRoutes.patch("/admin/chat/:id/status", requireAuth, asyncHandler(async (req, res) => {
  const { status } = req.body as { status: string };
  const allowed = ["new", "reviewed", "replied", "archived"];
  if (!allowed.includes(status)) throw new ApiError(400, "Invalid status");
  const msg = await TrainingChatMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!msg) throw new ApiError(404, "Message not found");
  logger.info("[CHAT ADMIN] Estado actualizado", { id: req.params.id, status });
  res.json(msg);
}));

trainingRoutes.delete("/admin/chat/:id", requireAuth, asyncHandler(async (req, res) => {
  const msg = await TrainingChatMessage.findByIdAndDelete(req.params.id);
  if (!msg) throw new ApiError(404, "Message not found");
  logger.info("[CHAT ADMIN] Mensaje eliminado", { id: req.params.id });
  res.status(204).send();
}));
