import { describe, expect, it } from "vitest";
import {
  inquiryCrmSchema,
  inquirySchema,
  newsSchema,
  postSchema,
  resourceSchema,
  serviceSchema,
  settingsSchema,
  trainingChatMessageSchema,
  trainingCourseSchema
} from "../schemas/content.schema.js";

describe("Schema validation — negative cases", () => {
  describe("postSchema", () => {
    it("rejects a title that is too short", () => {
      const result = postSchema.safeParse({ body: { title: "Hi", content: "Long enough content." } });
      expect(result.success).toBe(false);
    });

    it("rejects a title that exceeds 180 characters", () => {
      const result = postSchema.safeParse({ body: { title: "A".repeat(181), content: "Long enough content." } });
      expect(result.success).toBe(false);
    });

    it("rejects an empty content field", () => {
      const result = postSchema.safeParse({ body: { title: "Valid title here", content: "" } });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid status value", () => {
      const result = postSchema.safeParse({ body: { title: "Valid title here", content: "Some content", status: "deleted" } });
      expect(result.success).toBe(false);
    });

    it("accepts all valid statuses", () => {
      for (const status of ["draft", "published", "archived"]) {
        const result = postSchema.safeParse({ body: { title: "Valid title here", content: "Some content", status } });
        expect(result.success, `expected status ${status} to pass`).toBe(true);
      }
    });
  });

  describe("newsSchema", () => {
    it("rejects excerpt shorter than 20 characters", () => {
      const result = newsSchema.safeParse({
        body: { title: "Valid news title", excerpt: "Short", content: "Content long enough to pass validation." }
      });
      expect(result.success).toBe(false);
    });

    it("rejects content shorter than 20 characters", () => {
      const result = newsSchema.safeParse({
        body: { title: "Valid news title", excerpt: "Extracto suficientemente largo para validar.", content: "Short." }
      });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid status", () => {
      const result = newsSchema.safeParse({
        body: {
          title: "Valid news title",
          excerpt: "Extracto suficientemente largo para validar.",
          content: "Contenido suficientemente largo para una noticia.",
          status: "pending"
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("resourceSchema", () => {
    it("rejects an invalid resource type", () => {
      const result = resourceSchema.safeParse({
        body: {
          title: "Valid resource",
          description: "Descripcion suficientemente larga para un recurso valido.",
          type: "video",
          status: "published"
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects description shorter than 20 characters", () => {
      const result = resourceSchema.safeParse({
        body: { title: "Valid resource", description: "Too short.", type: "guia", status: "draft" }
      });
      expect(result.success).toBe(false);
    });

    it("rejects title shorter than 4 characters", () => {
      const result = resourceSchema.safeParse({
        body: { title: "ABC", description: "Descripcion suficientemente larga para un recurso valido.", type: "guia", status: "draft" }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("serviceSchema", () => {
    it("rejects shortDescription shorter than 20 characters", () => {
      const result = serviceSchema.safeParse({
        body: {
          title: "Valid service title",
          shortDescription: "Too short.",
          fullDescription: "Descripcion completa suficientemente larga para el servicio.",
          targetAudience: "Investigadores"
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing targetAudience shorter than 5 characters", () => {
      const result = serviceSchema.safeParse({
        body: {
          title: "Valid service title",
          shortDescription: "Descripcion breve suficientemente larga.",
          fullDescription: "Descripcion completa suficientemente larga.",
          targetAudience: "Med"
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("settingsSchema", () => {
    it("rejects invalid email for contactEmail", () => {
      const result = settingsSchema.safeParse({
        body: {
          siteTitle: "Doctor Tebar",
          heroTitle: "Metodologia clinica aplicada",
          heroSubtitle: "Acompanamiento metodologico para investigacion clinica rigurosa.",
          aboutText: "Texto suficientemente largo sobre la experiencia y enfoque metodologico.",
          contactEmail: "not-an-email"
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid hex color for accentColor", () => {
      const result = settingsSchema.safeParse({
        body: {
          siteTitle: "Doctor Tebar",
          heroTitle: "Metodologia clinica aplicada",
          heroSubtitle: "Acompanamiento metodologico para investigacion clinica rigurosa.",
          aboutText: "Texto suficientemente largo sobre la experiencia y enfoque.",
          contactEmail: "contacto@example.com",
          accentColor: "blue"
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects siteTitle shorter than 3 characters", () => {
      const result = settingsSchema.safeParse({
        body: {
          siteTitle: "AB",
          heroTitle: "Metodologia clinica aplicada",
          heroSubtitle: "Acompanamiento metodologico para investigacion clinica rigurosa.",
          aboutText: "Texto suficientemente largo sobre la experiencia.",
          contactEmail: "contacto@example.com"
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("inquirySchema", () => {
    it("rejects invalid email", () => {
      const result = inquirySchema.safeParse({
        body: {
          name: "Eduardo",
          email: "not-an-email",
          projectStage: "analisis",
          objectiveType: "causal",
          message: "Mensaje suficientemente largo para validar la consulta.",
          consent: true
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects a message shorter than 20 characters", () => {
      const result = inquirySchema.safeParse({
        body: {
          name: "Eduardo",
          email: "edu@example.com",
          projectStage: "analisis",
          objectiveType: "causal",
          message: "Short",
          consent: true
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid projectStage", () => {
      const result = inquirySchema.safeParse({
        body: {
          name: "Eduardo",
          email: "edu@example.com",
          projectStage: "financiacion",
          objectiveType: "causal",
          message: "Mensaje suficientemente largo para validar la consulta.",
          consent: true
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid objectiveType", () => {
      const result = inquirySchema.safeParse({
        body: {
          name: "Eduardo",
          email: "edu@example.com",
          projectStage: "analisis",
          objectiveType: "exploratorio",
          message: "Mensaje suficientemente largo para validar la consulta.",
          consent: true
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects a name shorter than 2 characters", () => {
      const result = inquirySchema.safeParse({
        body: {
          name: "E",
          email: "edu@example.com",
          projectStage: "analisis",
          objectiveType: "causal",
          message: "Mensaje suficientemente largo para validar la consulta.",
          consent: true
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("trainingCourseSchema", () => {
    it("rejects an empty title", () => {
      const result = trainingCourseSchema.safeParse({ body: { title: "", status: "draft" } });
      expect(result.success).toBe(false);
    });

    it("rejects a title exceeding 180 characters", () => {
      const result = trainingCourseSchema.safeParse({ body: { title: "T".repeat(181), status: "draft" } });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid status", () => {
      const result = trainingCourseSchema.safeParse({ body: { title: "Valid course title", status: "hidden" } });
      expect(result.success).toBe(false);
    });

    it("rejects topics with a title exceeding 180 characters", () => {
      const result = trainingCourseSchema.safeParse({
        body: {
          title: "Valid course title",
          status: "draft",
          blocks: [
            {
              title: "Block title",
              order: 0,
              status: "draft",
              topics: [{ title: "T".repeat(181), order: 0, status: "draft" }]
            }
          ]
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects learningObjectives that are not strings", () => {
      const result = trainingCourseSchema.safeParse({
        body: {
          title: "Valid course title",
          status: "draft",
          learningObjectives: [42, true]
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("trainingChatMessageSchema", () => {
    it("rejects a message shorter than 10 characters", () => {
      const result = trainingChatMessageSchema.safeParse({
        params: { slug: "test-course" },
        body: { message: "Short", consent: true }
      });
      expect(result.success).toBe(false);
    });

    it("rejects a message exceeding 2000 characters", () => {
      const result = trainingChatMessageSchema.safeParse({
        params: { slug: "test-course" },
        body: { message: "A".repeat(2001), consent: true }
      });
      expect(result.success).toBe(false);
    });

    it("rejects a missing slug param", () => {
      const result = trainingChatMessageSchema.safeParse({
        params: { slug: "" },
        body: { message: "Mensaje suficientemente largo para el chat.", consent: true }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("inquiryCrmSchema", () => {
    it("rejects an invalid priority value", () => {
      const result = inquiryCrmSchema.safeParse({
        params: { id: "valid-id" },
        body: { priority: "critical" }
      });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid status value", () => {
      const result = inquiryCrmSchema.safeParse({
        params: { id: "valid-id" },
        body: { status: "open" }
      });
      expect(result.success).toBe(false);
    });

    it("accepts an empty CRM update body", () => {
      const result = inquiryCrmSchema.safeParse({
        params: { id: "valid-id" },
        body: {}
      });
      expect(result.success).toBe(true);
    });
  });
});
