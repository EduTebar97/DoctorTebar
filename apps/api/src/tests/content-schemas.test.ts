import { describe, expect, it } from "vitest";
import { inquiryCrmSchema, inquirySchema, newsSchema, resourceSchema, serviceSchema, settingsSchema, trainingChatMessageSchema, trainingCourseSchema } from "../schemas/content.schema.js";

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

  it("validates training course payloads — minimal (title only)", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Formacion en metodologia clinica",
        status: "draft"
      }
    });
    expect(result.success).toBe(true);
  });

  it("validates training course payloads — with blocks and topics", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Modelos predictivos en investigacion clinica",
        description: "Curso introductorio sobre modelos predictivos.",
        status: "draft",
        featured: false,
        blocks: [
          {
            title: "Bloque 1: Fundamentos",
            order: 0,
            status: "draft",
            topics: [
              { title: "Que es un modelo predictivo", order: 0, status: "draft" },
              { title: "Diferencia entre causalidad y prediccion", order: 1, status: "draft" }
            ]
          }
        ]
      }
    });
    expect(result.success).toBe(true);
  });

  it("validates training chat message payloads", () => {
    const result = trainingChatMessageSchema.safeParse({
      params: { slug: "formacion-metodologia" },
      body: {
        topicId: "topic-id",
        message: "Quiero resolver una duda concreta sobre esta formacion.",
        consent: true
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

  it("validates import payload — full formation from markdown parser", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Formacion importada desde markdown",
        description: "Descripcion de la formacion importada.",
        status: "draft",
        featured: false,
        order: 0,
        coverImageUrl: "",
        blocks: [
          {
            title: "Bloque 1: Introduccion",
            description: "Descripcion del primer bloque.",
            order: 0,
            status: "draft",
            topics: [
              {
                title: "Tema 1: Conceptos basicos",
                description: "Descripcion breve del tema.",
                content: "Contenido extenso del primer tema.",
                imageUrls: [],
                videoUrl: "",
                order: 0,
                status: "draft"
              },
              {
                title: "Tema 2: Aplicaciones practicas",
                description: "",
                content: "Segundo bloque de contenido.",
                imageUrls: [],
                videoUrl: "",
                order: 1,
                status: "draft"
              }
            ]
          },
          {
            title: "Bloque 2: Avanzado",
            description: "",
            order: 1,
            status: "draft",
            topics: [
              {
                title: "Tema 3: Casos complejos",
                description: "",
                content: "Contenido del caso complejo.",
                imageUrls: [],
                videoUrl: "",
                order: 0,
                status: "draft"
              }
            ]
          }
        ]
      }
    });
    expect(result.success).toBe(true);
  });

  it("accepts imageUrls as array of non-URL strings", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Formacion con imagenes relativas",
        status: "draft",
        blocks: [
          {
            title: "Bloque con imagenes",
            order: 0,
            status: "draft",
            topics: [
              {
                title: "Tema con imagen relativa",
                order: 0,
                status: "draft",
                imageUrls: ["/uploads/imagen.jpg", "ruta-relativa/foto.png"]
              }
            ]
          }
        ]
      }
    });
    expect(result.success).toBe(true);
  });

  it("accepts imageUrls as comma-separated string (preprocess coercion)", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Formacion con imageUrls string",
        status: "draft",
        blocks: [
          {
            title: "Bloque",
            order: 0,
            status: "draft",
            topics: [
              {
                title: "Tema",
                order: 0,
                status: "draft",
                imageUrls: "https://example.com/a.jpg, https://example.com/b.jpg"
              }
            ]
          }
        ]
      }
    });
    expect(result.success).toBe(true);
    const parsed = result.data as any;
    expect(Array.isArray(parsed.body.blocks[0].topics[0].imageUrls)).toBe(true);
    expect(parsed.body.blocks[0].topics[0].imageUrls).toHaveLength(2);
  });

  it("accepts coverImageUrl as non-URL string (local path or empty)", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Formacion con coverImageUrl relativa",
        status: "draft",
        coverImageUrl: "/uploads/cover.jpg"
      }
    });
    expect(result.success).toBe(true);
  });

  it("accepts videoUrl as non-URL string (relative or embed path)", () => {
    const result = trainingCourseSchema.safeParse({
      body: {
        title: "Formacion con video relativo",
        status: "draft",
        blocks: [
          {
            title: "Bloque con video",
            order: 0,
            status: "draft",
            topics: [
              {
                title: "Tema con video",
                order: 0,
                status: "draft",
                videoUrl: "embed/video-id-123"
              }
            ]
          }
        ]
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
