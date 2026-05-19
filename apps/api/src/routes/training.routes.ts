import { Router } from "express";
import { logger } from "../config/logger.js";
import { TrainingChatMessage } from "../models/TrainingChatMessage.model.js";
import { TrainingCourse } from "../models/TrainingCourse.model.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";
import { inquiryRateLimit } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  idParamSchema,
  slugParamSchema,
  trainingBlockSchema,
  trainingChatMessageSchema,
  trainingCourseSchema,
  trainingTopicSchema
} from "../schemas/content.schema.js";
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

// ── Public endpoints ──────────────────────────────────────────────────────────

trainingRoutes.get("/training", asyncHandler(async (_req, res) => {
  logger.info("[FORMACION API] Petición recibida — GET /api/training");
  const items = await TrainingCourse.find({ status: "published" })
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 });
  logger.info("[FORMACION API] Formaciones publicadas devueltas", { count: items.length });
  res.json(items);
}));

trainingRoutes.get("/training/:slug", optionalAuth, validate(slugParamSchema), asyncHandler(async (req, res) => {
  logger.info("[FORMACION API] Petición recibida — GET /api/training/:slug", { slug: req.params.slug, authenticated: Boolean(req.user) });
  const item = await TrainingCourse.findOne({ slug: req.params.slug, status: "published" });
  if (!item) throw new ApiError(404, "Training course not found");

  if (!req.user) {
    logger.info("[FORMACION API] Usuario no autenticado — devolviendo estructura sin contenido", { slug: req.params.slug });
    const publicItem: any = item.toObject();
    publicItem.blocks = (publicItem.blocks ?? []).map((block: any) => ({
      _id: block._id,
      title: block.title,
      description: block.description,
      order: block.order,
      status: block.status,
      topics: (block.topics ?? []).map((topic: any) => ({
        _id: topic._id,
        title: topic.title,
        description: topic.description,
        order: topic.order,
        status: topic.status,
        imageUrls: [],
        content: "",
        videoUrl: ""
      }))
    }));
    return res.json({ ...publicItem, locked: true });
  }
  logger.info("[FORMACION API] Usuario autenticado — devolviendo contenido completo", { slug: req.params.slug, userId: String(req.user._id), rol: req.user.role });
  res.json(item);
}));

// ── Chat público (requiere autenticación) ─────────────────────────────────────

trainingRoutes.post("/training/:slug/chat", requireAuth, inquiryRateLimit, validate(trainingChatMessageSchema), asyncHandler(async (req, res) => {
  logger.info("[FORMACION API] Petición recibida — POST /api/training/:slug/chat", { slug: req.params.slug, userId: String(req.user!._id) });
  const course = await TrainingCourse.findOne({ slug: req.params.slug, status: "published" });
  if (!course) throw new ApiError(404, "Training course not found");

  const { consent: _consent, blockId, topicId, ...payload } = req.body;

  let topicTitle: string | undefined;
  let blockTitle: string | undefined;
  if (blockId) {
    const block = course.blocks.id(blockId);
    blockTitle = block?.title;
    if (topicId && block) topicTitle = block.topics.id(topicId)?.title;
  }

  logger.info("[FORMACION API] Guardando mensaje de chat", {
    courseSlug: course.slug, blockId: blockId || null, topicId: topicId || null,
    userId: String(req.user!._id)
  });

  const message = await TrainingChatMessage.create({
    message: payload.message,
    courseId: course._id,
    userId: req.user!._id,
    courseTitle: course.title,
    courseSlug: course.slug,
    blockId: blockId || undefined,
    blockTitle,
    topicId: topicId || undefined,
    topicTitle,
    name: req.user!.name,
    email: req.user!.email,
    ip: req.ip,
    userAgent: req.get("user-agent")
  });
  logger.info("[FORMACION API] Mensaje de chat guardado en base de datos", { id: String(message._id) });
  res.status(201).json(message);
}));

// ── Admin — Course CRUD ───────────────────────────────────────────────────────

trainingRoutes.get("/admin/training", requireAuth, asyncHandler(async (_req, res) => {
  logger.info("[FORMACION API] GET /api/admin/training — listando cursos");
  const items = await TrainingCourse.find().sort({ updatedAt: -1 });
  logger.info("[FORMACION API] Cursos devueltos", { count: items.length });
  res.json(items);
}));

trainingRoutes.get("/admin/training/:id", requireAuth, validate(idParamSchema), asyncHandler(async (req, res) => {
  logger.info("[FORMACION API] GET /api/admin/training/:id", { id: req.params.id });
  const item = await TrainingCourse.findById(req.params.id);
  if (!item) throw new ApiError(404, "Training course not found");
  res.json(item);
}));

trainingRoutes.post("/admin/training", requireAuth, validate(trainingCourseSchema), asyncHandler(async (req, res) => {
  logger.info("[FORMACION API] Crear formación — payload recibido", {
    titulo: req.body.title,
    bloques: req.body.blocks?.length ?? 0,
    estado: req.body.status,
    usuario: String(req.user!._id),
    rol: req.user!.role
  });
  const payload = { ...req.body, slug: await uniqueTrainingSlug(req.body.title) };
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
  const item = await TrainingCourse.create(payload);
  await audit(req, "create", "training", String(item._id));
  logger.info("[FORMACION API] Formación guardada en base de datos", { id: String(item._id), slug: item.slug });
  res.status(201).json(item);
}));

trainingRoutes.put("/admin/training/:id", requireAuth, validate(trainingCourseSchema.merge(idParamSchema)), asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  logger.info("[FORMACION API] Actualizar formación", {
    id, titulo: req.body.title,
    bloques: req.body.blocks?.length ?? 0,
    estado: req.body.status,
    usuario: String(req.user!._id)
  });
  const { blocks: _blocks, ...bodyWithoutBlocks } = req.body;
  const payload: Record<string, unknown> = { ...bodyWithoutBlocks, slug: await uniqueTrainingSlug(req.body.title, id) };
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
  if (_blocks !== undefined) payload.blocks = _blocks;
  const item = await TrainingCourse.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Training course not found");
  await audit(req, "update", "training", String(item._id));
  logger.info("[FORMACION API] Formación actualizada en base de datos", { id: String(item._id) });
  res.json(item);
}));

trainingRoutes.delete("/admin/training/:id", requireAuth, validate(idParamSchema), asyncHandler(async (req, res) => {
  logger.info("[FORMACION API] Eliminar formación", { id: req.params.id, usuario: String(req.user!._id) });
  const item = await TrainingCourse.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Training course not found");
  await audit(req, "delete", "training", String(item._id));
  logger.info("[FORMACION API] Formación eliminada", { id: req.params.id });
  res.status(204).send();
}));

// ── Admin — Block CRUD (subdocument updates) ──────────────────────────────────

trainingRoutes.post("/admin/training/:courseId/blocks", requireAuth, validate(trainingBlockSchema), asyncHandler(async (req, res) => {
  const course = await TrainingCourse.findById(req.params.courseId);
  if (!course) throw new ApiError(404, "Training course not found");
  logger.info("[FORMACION API] Crear bloque", { courseId: req.params.courseId, titulo: req.body.title });
  course.blocks.push(req.body);
  await course.save();
  const newBlock = course.blocks[course.blocks.length - 1];
  logger.info("[FORMACION API] Bloque guardado en base de datos", { blockId: String(newBlock._id) });
  res.status(201).json(newBlock);
}));

trainingRoutes.put("/admin/blocks/:blockId", requireAuth, asyncHandler(async (req, res) => {
  const blockId = String(req.params.blockId);
  logger.info("[FORMACION API] Actualizar bloque", { blockId });
  const course = await TrainingCourse.findOne({ "blocks._id": blockId });
  if (!course) throw new ApiError(404, "Block not found");
  const block = course.blocks.id(blockId);
  if (!block) throw new ApiError(404, "Block not found");
  Object.assign(block, req.body);
  await course.save();
  logger.info("[FORMACION API] Bloque actualizado", { blockId });
  res.json(block);
}));

trainingRoutes.delete("/admin/blocks/:blockId", requireAuth, asyncHandler(async (req, res) => {
  const blockId = String(req.params.blockId);
  logger.info("[FORMACION API] Eliminar bloque", { blockId });
  const course = await TrainingCourse.findOne({ "blocks._id": blockId });
  if (!course) throw new ApiError(404, "Block not found");
  course.blocks.pull({ _id: blockId });
  await course.save();
  logger.info("[FORMACION API] Bloque eliminado", { blockId });
  res.status(204).send();
}));

// ── Admin — Topic CRUD (subdocument updates) ──────────────────────────────────

trainingRoutes.post("/admin/blocks/:blockId/topics", requireAuth, validate(trainingTopicSchema), asyncHandler(async (req, res) => {
  const blockId = String(req.params.blockId);
  logger.info("[FORMACION API] Crear tema", { blockId, titulo: req.body.title });
  const course = await TrainingCourse.findOne({ "blocks._id": blockId });
  if (!course) throw new ApiError(404, "Block not found");
  const block = course.blocks.id(blockId);
  if (!block) throw new ApiError(404, "Block not found");
  block.topics.push(req.body);
  await course.save();
  const newTopic = block.topics[block.topics.length - 1];
  logger.info("[FORMACION API] Tema guardado en base de datos", { topicId: String(newTopic._id) });
  res.status(201).json(newTopic);
}));

trainingRoutes.put("/admin/topics/:topicId", requireAuth, asyncHandler(async (req, res) => {
  const topicId = String(req.params.topicId);
  logger.info("[FORMACION API] Actualizar tema", { topicId });
  const course = await TrainingCourse.findOne({ "blocks.topics._id": topicId });
  if (!course) throw new ApiError(404, "Topic not found");
  let foundTopic: any = null;
  for (const block of course.blocks) {
    const topic = block.topics.id(topicId);
    if (topic) { foundTopic = topic; break; }
  }
  if (!foundTopic) throw new ApiError(404, "Topic not found");
  Object.assign(foundTopic, req.body);
  await course.save();
  logger.info("[FORMACION API] Tema actualizado", { topicId });
  res.json(foundTopic);
}));

trainingRoutes.delete("/admin/topics/:topicId", requireAuth, asyncHandler(async (req, res) => {
  const topicId = String(req.params.topicId);
  logger.info("[FORMACION API] Eliminar tema", { topicId });
  const course = await TrainingCourse.findOne({ "blocks.topics._id": topicId });
  if (!course) throw new ApiError(404, "Topic not found");
  for (const block of course.blocks) {
    const topic = block.topics.id(topicId);
    if (topic) { block.topics.pull({ _id: topicId }); break; }
  }
  await course.save();
  logger.info("[FORMACION API] Tema eliminado", { topicId });
  res.status(204).send();
}));

// ── Admin chat endpoints ──────────────────────────────────────────────────────

trainingRoutes.get("/admin/chat", requireAuth, asyncHandler(async (req, res) => {
  const { course, user, topic, block, status } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (course) filter.courseSlug = course;
  if (user) filter.$or = [
    { name: { $regex: user, $options: "i" } },
    { email: { $regex: user, $options: "i" } }
  ];
  if (topic) filter.topicTitle = { $regex: topic, $options: "i" };
  if (block) filter.blockTitle = { $regex: block, $options: "i" };
  if (status) filter.status = status;
  logger.info("[CHAT ADMIN] Consultando conversaciones", { course, user, topic, block, status });
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
          total: { $sum: "$count" },
          open: { $sum: "$open" },
          courses: { $push: { courseTitle: "$courseTitle", courseSlug: "$courseSlug", count: "$count" } },
          distinctCourses: { $addToSet: "$courseSlug" },
          lastActivity: { $max: "$lastActivity" }
        }
      },
      { $addFields: { distinctCourseCount: { $size: "$distinctCourses" } } },
      { $project: { distinctCourses: 0 } },
      { $sort: { total: -1 } }
    ])
  ]);

  const total = totals[0]?.total ?? 0;
  const open = totals[0]?.open ?? 0;
  const usersWithMultipleCourses = byUserRaw.filter((u: any) => u.distinctCourseCount > 1).length;

  const metrics = {
    total,
    open,
    byFormation: byFormationRaw,
    byUser: byUserRaw,
    usersWithMultipleCourses
  };
  logger.info("[CHAT ADMIN] Métricas calculadas", { total, open, formations: byFormationRaw.length, users: byUserRaw.length });
  res.json(metrics);
}));

trainingRoutes.patch("/admin/chat/:id/status", requireAuth, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["new", "reviewed", "replied", "archived"].includes(status)) throw new ApiError(400, "Invalid status");
  const message = await TrainingChatMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!message) throw new ApiError(404, "Chat message not found");
  logger.info("[CHAT ADMIN] Estado de mensaje actualizado", { id: req.params.id, status });
  res.json(message);
}));

trainingRoutes.delete("/admin/chat/:id", requireAuth, asyncHandler(async (req, res) => {
  const message = await TrainingChatMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Chat message not found");
  logger.info("[CHAT ADMIN] Mensaje eliminado", { id: req.params.id });
  res.status(204).send();
}));
