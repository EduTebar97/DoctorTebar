import { z } from "zod";

export const trainingTopicSchema = z.object({
  title: z.string().min(1, "El título del tema es obligatorio"),
  description: z.string().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  imageUrls: z.preprocess((value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  }, z.array(z.string()).default([])),
  videoUrl: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published"]).default("draft")
});

export const trainingBlockSchema = z.object({
  title: z.string().min(1, "El título del bloque es obligatorio"),
  description: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  status: z.enum(["draft", "published"]).default("draft"),
  topics: z.array(trainingTopicSchema).default([])
});

export const trainingFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  blocks: z.array(trainingBlockSchema).default([]),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0)
});

export type TrainingTopicData = z.infer<typeof trainingTopicSchema>;
export type TrainingBlockData = z.infer<typeof trainingBlockSchema>;
export type TrainingFormData = z.infer<typeof trainingFormSchema>;
