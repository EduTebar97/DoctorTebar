import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(20),
  content: z.string().min(20),
  coverImageUrl: z.string().optional(),
  category: z.enum(["causalidad", "prediccion", "reporte", "stata", "errores", "general"]),
  tags: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export type PostFormData = z.infer<typeof postFormSchema>;
