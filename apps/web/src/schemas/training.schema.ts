import { z } from "zod";

export const trainingFormSchema = z.object({
  title: z.string().min(5),
  summary: z.string().min(20),
  description: z.string().min(20),
  level: z.enum(["introductorio", "intermedio", "avanzado"]),
  access: z.enum(["public", "private"]),
  coverImageUrl: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  topics: z.array(z.object({
    title: z.string().min(3),
    summary: z.string().optional(),
    content: z.string().optional(),
    imageUrls: z.preprocess((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
      return [];
    }, z.array(z.string()).default([])),
    videoUrl: z.string().optional(),
    order: z.coerce.number().int().default(0)
  })).default([]),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false)
});

export type TrainingFormData = z.infer<typeof trainingFormSchema>;
