import { z } from "zod";

export const resourceFormSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(20),
  type: z.enum(["checklist", "plantilla", "guia", "codigo", "bibliografia"]),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  status: z.enum(["draft", "published", "archived"])
});

export type ResourceFormData = z.infer<typeof resourceFormSchema>;
