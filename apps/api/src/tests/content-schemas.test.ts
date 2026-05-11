import { describe, expect, it } from "vitest";
import { inquiryCrmSchema, inquirySchema, newsSchema, resourceSchema, serviceSchema, settingsSchema } from "../schemas/content.schema.js";

describe("Content schemas", () => {
  it("validates news payloads", () => {
    const result = newsSchema.safeParse({
      body: {
        title: "Nueva evidencia clinica",
        excerpt: "Resumen suficientemente largo para una noticia valida.",
        content: "<p>Contenido suficientemente largo para una noticia valida.</p>",
        status: "published",
        featured: false
      }
    });

    expect(result.success).toBe(true);
  });

  it("validates resource payloads", () => {
    const result = resourceSchema.safeParse({
      body: {
        title: "Checklist de protocolo",
        description: "Descripcion suficientemente larga para un recurso valido.",
        type: "checklist",
        externalUrl: "https://example.com/checklist",
        status: "published"
      }
    });

    expect(result.success).toBe(true);
  });

  it("validates service payloads", () => {
    const result = serviceSchema.safeParse({
      body: {
        title: "Asesoria metodologica",
        shortDescription: "Descripcion breve suficientemente larga para validar.",
        fullDescription: "Descripcion completa suficientemente larga para validar el servicio.",
        targetAudience: "Investigadores clinicos",
        deliverables: ["Informe", "Plan de analisis"],
        status: "published",
        order: 1
      }
    });

    expect(result.success).toBe(true);
  });

  it("validates inquiry payloads", () => {
    const result = inquirySchema.safeParse({
      body: {
        name: "Eduardo",
        email: "eduardo@example.com",
        organization: "Hospital",
        projectStage: "analisis",
        objectiveType: "causal",
        message: "Mensaje suficientemente largo para validar la consulta.",
        consent: true
      }
    });

    expect(result.success).toBe(true);
  });

  it("validates CRM inquiry updates", () => {
    const result = inquiryCrmSchema.safeParse({
      params: { id: "inquiry-id" },
      body: {
        status: "proposal_sent",
        priority: "high",
        estimatedValue: "2500",
        nextAction: "Enviar propuesta metodologica",
        nextActionAt: "2026-05-20",
        source: "linkedin",
        serviceInterest: "Revision metodologica"
      }
    });

    expect(result.success).toBe(true);
  });

  it("validates settings payloads", () => {
    const result = settingsSchema.safeParse({
      body: {
        siteTitle: "Doctor Tebar",
        heroTitle: "Metodologia clinica aplicada",
        heroSubtitle: "Acompanamiento metodologico para investigacion clinica rigurosa.",
        aboutText: "Texto suficientemente largo sobre la experiencia y enfoque metodologico.",
        contactEmail: "contacto@example.com",
        linkedinUrl: "https://www.linkedin.com/",
        accentColor: "#2563eb"
      }
    });

    expect(result.success).toBe(true);
  });
});
