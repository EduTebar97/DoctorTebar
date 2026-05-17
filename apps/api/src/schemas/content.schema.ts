import { z } from "zod";

export const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
export const slugParamSchema = z.object({ params: z.object({ slug: z.string().min(1) }) });

export const postSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(180),
    excerpt: z.string().max(500).optional().or(z.literal("")),
    content: z.string().min(1),
    coverImageUrl: z.string().url().optional().or(z.literal("")),
    category: z.enum(["causalidad", "prediccion", "reporte", "stata", "errores", "general"]).default("general"),
    tags: z.array(z.string().max(40)).default([]),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    featured: z.boolean().default(false),
    seoTitle: z.string().max(180).optional().or(z.literal("")),
    seoDescription: z.string().max(300).optional().or(z.literal(""))
  })
});

export const newsSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(180),
    excerpt: z.string().min(20).max(500),
    content: z.string().min(20),
    coverImageUrl: z.string().url().optional().or(z.literal("")),
    sourceName: z.string().max(120).optional().or(z.literal("")),
    sourceUrl: z.string().url().optional().or(z.literal("")),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    featured: z.boolean().default(false)
  })
});

export const resourceSchema = z.object({
  body: z.object({
    title: z.string().min(4).max(160),
    description: z.string().min(20).max(700),
    type: z.enum(["checklist", "plantilla", "guia", "codigo", "bibliografia"]),
    fileUrl: z.string().url().optional().or(z.literal("")),
    externalUrl: z.string().url().optional().or(z.literal("")),
    status: z.enum(["draft", "published", "archived"]).default("draft")
  })
});

export const trainingCourseSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(180),
    summary: z.string().min(20).max(500),
    description: z.string().min(20),
    level: z.enum(["introductorio", "intermedio", "avanzado"]).default("intermedio"),
    access: z.enum(["public", "private"]).default("private"),
    coverImageUrl: z.string().url().optional().or(z.literal("")),
    price: z.string().max(80).optional().or(z.literal("")),
    duration: z.string().max(80).optional().or(z.literal("")),
    topics: z.array(z.object({
      title: z.string().min(3).max(180),
      summary: z.string().max(500).optional().or(z.literal("")),
      content: z.string().optional().or(z.literal("")),
      imageUrls: z.array(z.string().url()).default([]),
      videoUrl: z.string().url().optional().or(z.literal("")),
      order: z.coerce.number().int().default(0)
    })).default([]),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    featured: z.boolean().default(false)
  })
});

export const trainingChatMessageSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
  body: z.object({
    topicId: z.string().optional().or(z.literal("")),
    message: z.string().min(10).max(2000),
    consent: z.boolean().optional()
  })
});

export const serviceSchema = z.object({
  body: z.object({
    title: z.string().min(4).max(160),
    shortDescription: z.string().min(20).max(300),
    fullDescription: z.string().min(20),
    targetAudience: z.string().min(5),
    deliverables: z.array(z.string().min(2)).default([]),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    order: z.number().int().default(0)
  })
});

export const inquirySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    organization: z.string().max(160).optional().or(z.literal("")),
    projectStage: z.enum(["idea", "protocolo", "analisis", "manuscrito", "revision"]),
    objectiveType: z.enum(["causal", "predictivo", "descriptivo", "diagnostico", "pronostico", "mixto", "no_claro"]),
    message: z.string().min(20).max(4000),
    consent: z.boolean().optional()
  })
});

export const inquiryStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ status: z.enum(["new", "reviewed", "pending_reply", "replied", "meeting_proposed", "proposal_sent", "accepted", "discarded", "archived"]) })
});

export const inquiryNotesSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ internalNotes: z.string().max(4000).optional().or(z.literal("")) })
});

export const inquiryCrmSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: z.enum(["new", "reviewed", "pending_reply", "replied", "meeting_proposed", "proposal_sent", "accepted", "discarded", "archived"]).optional(),
    internalNotes: z.string().max(4000).optional().or(z.literal("")),
    priority: z.enum(["low", "medium", "high"]).optional(),
    estimatedValue: z.coerce.number().min(0).optional().or(z.literal("")),
    nextAction: z.string().max(500).optional().or(z.literal("")),
    nextActionAt: z.string().optional().or(z.literal("")),
    source: z.enum(["contact_form", "linkedin", "email", "referral", "other"]).optional(),
    serviceInterest: z.string().max(160).optional().or(z.literal(""))
  })
});

export const settingsSchema = z.object({
  body: z.object({
    siteTitle: z.string().min(3),
    heroTitle: z.string().min(10),
    heroSubtitle: z.string().min(20),
    aboutText: z.string().min(20),
    contactEmail: z.string().email(),
    linkedinUrl: z.string().url().optional().or(z.literal("")),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal(""))
  })
});
