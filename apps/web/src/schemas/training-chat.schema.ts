import { z } from "zod";

export const trainingChatSchema = z.object({
  blockId: z.string().optional().or(z.literal("")),
  topicId: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Escribe una pregunta un poco más detallada").max(2000),
  consent: z.boolean().refine(Boolean, "Acepta el contacto para poder responderte")
});

export type TrainingChatFormData = z.infer<typeof trainingChatSchema>;
