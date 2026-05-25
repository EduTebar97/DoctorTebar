import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().optional(),
  thesis: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().optional(),
  category: z.enum(["causalidad", "prediccion", "reporte", "stata", "errores", "general"]).default("general"),
  tags: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export type PostFormData = z.infer<typeof postFormSchema>;
