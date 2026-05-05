import { z } from "zod";

export const serviceFormSchema = z.object({
  title: z.string().min(4),
  shortDescription: z.string().min(20),
  fullDescription: z.string().min(20),
  targetAudience: z.string().min(5),
  deliverables: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  order: z.coerce.number().int()
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
