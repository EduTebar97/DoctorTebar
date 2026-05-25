import { describe, expect, it } from "vitest";
import { parseFormationMarkdown, validateFormationImport } from "../../utils/formation-parser";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMinimalDoc(overrides: {
  yamlExtra?: string;
  blockTitle?: string;
  blockDesc?: string;
  topicTitle?: string;
  topicDesc?: string;
  topicContent?: string;
} = {}): string {
  const {
    yamlExtra = "",
    blockTitle = "Fundamentos",
    blockDesc = "Descripción del bloque de fundamentos.",
    topicTitle = "Concepto básico",
    topicDesc = "Descripción breve del tema.",
    topicContent = "Contenido completo del tema."
  } = overrides;

  return `---
type: formation
version: 1
title: "Formación de prueba"
description: "Descripción de la formación de prueba."
status: "draft"
${yamlExtra}
---

# Bloque: ${blockTitle}

## Descripción del bloque

${blockDesc}

## Tema: ${topicTitle}

### Descripción del tema

${topicDesc}

### Contenido

${topicContent}
`;
}

// ── Caso 1: documento válido completo ─────────────────────────────────────────

describe("Caso 1: documento válido completo (3 bloques, 5 temas cada uno)", () => {
  function makeFullDoc(): string {
    let doc = `---
type: formation
version: 1
title: "Modelos predictivos clínicos"
description: "Curso completo sobre modelos predictivos."
status: "draft"
---
`;
    for (let b = 1; b <= 3; b++) {
      doc += `\n# Bloque: Bloque ${b}\n\n## Descripción del bloque\n\nDescripción del bloque ${b}.\n`;
      for (let t = 1; t <= 5; t++) {
        doc += `\n## Tema: Tema ${b}.${t}\n\n### Descripción del tema\n\nDescripción del tema ${b}.${t}.\n\n### Contenido\n\nContenido completo del tema ${b}.${t}. Texto suficientemente largo.\n`;
      }
    }
    return doc;
  }

  const result = parseFormationMarkdown(makeFullDoc());
  const errors = validateFormationImport(result);

  it("no produce errores de validación", () => {
    expect(errors).toHaveLength(0);
  });

  it("extrae el título de la formación", () => {
    expect(result.metadata.title).toBe("Modelos predictivos clínicos");
  });

  it("extrae la descripción de la formación", () => {
    expect(result.metadata.description).toBe("Curso completo sobre modelos predictivos.");
  });

  it("detecta 3 bloques", () => {
    expect(result.blocks).toHaveLength(3);
  });

  it("detecta 5 temas en cada bloque", () => {
    result.blocks.forEach((block) => {
      expect(block.topics).toHaveLength(5);
    });
  });

  it("asigna orden correcto a los bloques", () => {
    result.blocks.forEach((block, i) => {
      expect(block.order).toBe(i);
    });
  });

  it("asigna orden correcto a los temas", () => {
    result.blocks.forEach((block) => {
      block.topics.forEach((topic, i) => {
        expect(topic.order).toBe(i);
      });
    });
  });

  it("extrae título, descripción y contenido de los temas", () => {
    const firstTopic = result.blocks[0].topics[0];
    expect(firstTopic.title).toBe("Tema 1.1");
    expect(firstTopic.description).toBeTruthy();
    expect(firstTopic.content).toBeTruthy();
  });

  it("los temas tienen imageUrls vacío y videoUrl vacío por defecto", () => {
    result.blocks.forEach((block) => {
      block.topics.forEach((topic) => {
        expect(topic.imageUrls).toEqual([]);
        expect(topic.videoUrl).toBe("");
      });
    });
  });

  it("el status por defecto es draft", () => {
    expect(result.metadata.status).toBe("draft");
    result.blocks.forEach((block) => {
      expect(block.status).toBe("draft");
      block.topics.forEach((topic) => {
        expect(topic.status).toBe("draft");
      });
    });
  });
});

// ── Caso 2: bloque sin descripción ───────────────────────────────────────────

describe("Caso 2: documento con un bloque sin descripción", () => {
  const doc = `---
type: formation
version: 1
title: "Formación con error"
description: "Test de bloque sin descripción."
---

# Bloque: Bloque sin descripción

## Tema: Tema 1

### Descripción del tema

Descripción del tema.

### Contenido

Contenido del tema.
`;

  const result = parseFormationMarkdown(doc);
  const errors = validateFormationImport(result);

  it("produce al menos un error", () => {
    expect(errors.length).toBeGreaterThan(0);
  });

  it("el error menciona que falta la descripción del bloque", () => {
    const hasDescError = errors.some((e) =>
      e.toLowerCase().includes("descripción") || e.toLowerCase().includes("descripcion")
    );
    expect(hasDescError).toBe(true);
  });

  it("el error identifica el bloque concreto", () => {
    const blockError = errors.some((e) => e.includes("Bloque 1") || e.includes("Bloque sin descripción"));
    expect(blockError).toBe(true);
  });

  it("parse produce el bloque aunque la descripción esté vacía", () => {
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0].description).toBe("");
  });
});

// ── Caso 3: tema sin contenido ────────────────────────────────────────────────

describe("Caso 3: tema sin sección de contenido", () => {
  const doc = `---
type: formation
version: 1
title: "Formación con error"
description: "Test de tema sin contenido."
---

# Bloque: Bloque válido

## Descripción del bloque

Descripción del bloque.

## Tema: Tema sin contenido

### Descripción del tema

Descripción del tema.
`;

  const result = parseFormationMarkdown(doc);
  const errors = validateFormationImport(result);

  it("produce error de validación", () => {
    expect(errors.length).toBeGreaterThan(0);
  });

  it("el error menciona que falta el contenido", () => {
    const hasContentError = errors.some((e) => e.toLowerCase().includes("contenido"));
    expect(hasContentError).toBe(true);
  });

  it("el error identifica el tema concreto", () => {
    const topicError = errors.some((e) =>
      e.includes("Tema sin contenido") || e.includes("tema 1")
    );
    expect(topicError).toBe(true);
  });

  it("el tema existe pero su contenido está vacío", () => {
    expect(result.blocks[0].topics[0].content).toBe("");
  });
});

// ── Caso 4: tema antes de bloque ──────────────────────────────────────────────

describe("Caso 4: tema aparece antes de definir un bloque", () => {
  const doc = `---
type: formation
version: 1
title: "Formación con error"
description: "Test de tema fuera de bloque."
---

## Tema: Tema huérfano

### Descripción del tema

Descripción.

### Contenido

Contenido.
`;

  const result = parseFormationMarkdown(doc);

  it("el error aparece en parsed.errors", () => {
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("el error menciona que el tema aparece antes de un bloque", () => {
    const orphanError = result.errors.some((e) =>
      e.toLowerCase().includes("antes de definir un bloque") ||
      e.toLowerCase().includes("antes de")
    );
    expect(orphanError).toBe(true);
  });

  it("no crea bloques ni temas huérfanos en la estructura", () => {
    expect(result.blocks).toHaveLength(0);
  });
});

// ── Caso 5: importación parcial ───────────────────────────────────────────────

describe("Caso 5: importación parcial (1 bloque, 2 temas)", () => {
  const doc = `---
type: formation
version: 1
title: "Formación parcial"
description: "Solo el primer bloque."
---

# Bloque: Bloque inicial

## Descripción del bloque

Primer bloque de la formación.

## Tema: Tema 1

### Descripción del tema

Descripción del primer tema.

### Contenido

Contenido del primer tema.

## Tema: Tema 2

### Descripción del tema

Descripción del segundo tema.

### Contenido

Contenido del segundo tema.
`;

  const result = parseFormationMarkdown(doc);
  const errors = validateFormationImport(result);

  it("se importa sin errores", () => {
    expect(errors).toHaveLength(0);
  });

  it("detecta 1 bloque", () => {
    expect(result.blocks).toHaveLength(1);
  });

  it("detecta 2 temas en el bloque", () => {
    expect(result.blocks[0].topics).toHaveLength(2);
  });

  it("el primer tema tiene título, descripción y contenido", () => {
    const t = result.blocks[0].topics[0];
    expect(t.title).toBe("Tema 1");
    expect(t.description).toBeTruthy();
    expect(t.content).toBeTruthy();
  });
});

// ── Caso 5b: modo append — sin frontmatter ────────────────────────────────────

describe("Caso 5b: modo append (solo bloques, sin YAML frontmatter)", () => {
  const doc = `# Bloque: Bloque adicional

## Descripción del bloque

Bloque añadido desde documento parcial.

## Tema: Tema extra

### Descripción del tema

Descripción del tema extra.

### Contenido

Contenido del tema extra.
`;

  const result = parseFormationMarkdown(doc);
  const errorsAppend = validateFormationImport(result, { requireMetadata: false });
  const errorsFull = validateFormationImport(result, { requireMetadata: true });

  it("en modo append no produce errores", () => {
    expect(errorsAppend).toHaveLength(0);
  });

  it("en modo full sí produce errores de metadata", () => {
    expect(errorsFull.some((e) => e.toLowerCase().includes("título"))).toBe(true);
  });

  it("detecta el bloque correctamente", () => {
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0].title).toBe("Bloque adicional");
    expect(result.blocks[0].topics).toHaveLength(1);
  });
});

// ── Caso 6: formación importada correctamente (integración de estructura) ──────

describe("Caso 6: estructura de datos compatible con el schema del backend", () => {
  const result = parseFormationMarkdown(makeMinimalDoc());
  const errors = validateFormationImport(result);

  it("no hay errores", () => {
    expect(errors).toHaveLength(0);
  });

  it("el payload resultante tiene la estructura del schema de TrainingCourse", () => {
    const payload = {
      title: result.metadata.title,
      description: result.metadata.description,
      status: result.metadata.status,
      featured: result.metadata.featured,
      order: result.metadata.order,
      coverImageUrl: result.metadata.coverImageUrl,
      blocks: result.blocks
    };

    expect(typeof payload.title).toBe("string");
    expect(typeof payload.description).toBe("string");
    expect(["draft", "published", "archived"]).toContain(payload.status);
    expect(typeof payload.featured).toBe("boolean");
    expect(typeof payload.order).toBe("number");
    expect(Array.isArray(payload.blocks)).toBe(true);

    payload.blocks.forEach((block) => {
      expect(typeof block.title).toBe("string");
      expect(typeof block.description).toBe("string");
      expect(typeof block.order).toBe("number");
      expect(["draft", "published"]).toContain(block.status);
      expect(Array.isArray(block.topics)).toBe(true);

      block.topics.forEach((topic) => {
        expect(typeof topic.title).toBe("string");
        expect(typeof topic.description).toBe("string");
        expect(typeof topic.content).toBe("string");
        expect(typeof topic.order).toBe("number");
        expect(["draft", "published"]).toContain(topic.status);
        expect(Array.isArray(topic.imageUrls)).toBe(true);
        expect(typeof topic.videoUrl).toBe("string");
      });
    });
  });

  it("status se hereda del YAML cuando se especifica", () => {
    const doc = makeMinimalDoc({ yamlExtra: 'status: "published"' });
    const r = parseFormationMarkdown(doc);
    expect(r.metadata.status).toBe("published");
  });
});

// ── Caso 7: documento largo (10 bloques, 20 temas por bloque) ─────────────────

describe("Caso 7: documento largo (10 bloques, 20 temas cada uno = 200 temas)", () => {
  function makeLargeDoc(): string {
    let doc = `---
type: formation
version: 1
title: "Formación extensa"
description: "Formación con mucho contenido para probar rendimiento y orden."
status: "draft"
---
`;
    for (let b = 1; b <= 10; b++) {
      doc += `\n# Bloque: Bloque ${b}\n\n## Descripción del bloque\n\nDescripción del bloque ${b}.\n`;
      for (let t = 1; t <= 20; t++) {
        doc += `\n## Tema: Tema ${b}-${t}\n\n### Descripción del tema\n\nDescripción del tema ${b}-${t}.\n\n### Contenido\n\nContenido completo del tema ${b}-${t}. Este contenido puede ser largo y tener múltiples párrafos.\n\nSegundo párrafo del tema ${b}-${t}.\n`;
      }
    }
    return doc;
  }

  const result = parseFormationMarkdown(makeLargeDoc());
  const errors = validateFormationImport(result);

  it("no produce errores de validación", () => {
    expect(errors).toHaveLength(0);
  });

  it("detecta exactamente 10 bloques", () => {
    expect(result.blocks).toHaveLength(10);
  });

  it("cada bloque tiene exactamente 20 temas", () => {
    result.blocks.forEach((block) => {
      expect(block.topics).toHaveLength(20);
    });
  });

  it("el total de temas es 200", () => {
    const total = result.blocks.reduce((acc, b) => acc + b.topics.length, 0);
    expect(total).toBe(200);
  });

  it("mantiene el orden correcto de bloques y temas", () => {
    result.blocks.forEach((block, bi) => {
      expect(block.order).toBe(bi);
      expect(block.title).toBe(`Bloque ${bi + 1}`);
      block.topics.forEach((topic, ti) => {
        expect(topic.order).toBe(ti);
        expect(topic.title).toBe(`Tema ${bi + 1}-${ti + 1}`);
      });
    });
  });

  it("todos los temas tienen contenido multipárrafo preservado", () => {
    result.blocks.forEach((block) => {
      block.topics.forEach((topic) => {
        expect(topic.content).toContain("Segundo párrafo");
      });
    });
  });
});

// ── Casos de edge adicionales ─────────────────────────────────────────────────

describe("Edge cases del parser", () => {
  it("tolerancia a tildes: Descripción / Descripcion", () => {
    const doc = `---
type: formation
version: 1
title: "Test"
description: "Test desc"
---

# Bloque: Bloque A

## Descripcion del bloque

Sin tilde en descripción.

## Tema: Tema A

### Descripcion del tema

Sin tilde en descripción de tema.

### Contenido

Contenido.
`;
    const result = parseFormationMarkdown(doc);
    const errors = validateFormationImport(result);
    expect(errors).toHaveLength(0);
    expect(result.blocks[0].description).toBeTruthy();
    expect(result.blocks[0].topics[0].description).toBeTruthy();
  });

  it("respeta el status 'published' desde YAML", () => {
    const doc = `---
type: formation
version: 1
title: "Test"
description: "Test"
status: "published"
---

# Bloque: B

## Descripción del bloque

Desc.

## Tema: T

### Descripción del tema

Desc.

### Contenido

Contenido.
`;
    const result = parseFormationMarkdown(doc);
    expect(result.metadata.status).toBe("published");
  });

  it("ignora status inválido y usa draft", () => {
    const doc = `---
type: formation
version: 1
title: "Test"
description: "Test"
status: "invalid_status"
---

# Bloque: B

## Descripción del bloque

Desc.

## Tema: T

### Descripción del tema

Desc.

### Contenido

Contenido.
`;
    const result = parseFormationMarkdown(doc);
    expect(result.metadata.status).toBe("draft");
  });

  it("el contenido multilínea se preserva correctamente", () => {
    const content = "Línea uno.\n\nLínea dos separada por párrafo.\n\nLínea tres.";
    const doc = makeMinimalDoc({ topicContent: content });
    const result = parseFormationMarkdown(doc);
    expect(result.blocks[0].topics[0].content).toContain("Línea uno");
    expect(result.blocks[0].topics[0].content).toContain("Línea dos");
    expect(result.blocks[0].topics[0].content).toContain("Línea tres");
  });

  it("un archivo vacío devuelve estructura vacía con errores de validación", () => {
    const result = parseFormationMarkdown("");
    const errors = validateFormationImport(result);
    expect(result.blocks).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("YAML sin title produce error de validación", () => {
    const doc = `---
type: formation
version: 1
description: "Sin título"
---

# Bloque: B

## Descripción del bloque

Desc.

## Tema: T

### Descripción del tema

Desc.

### Contenido

Contenido.
`;
    const result = parseFormationMarkdown(doc);
    const errors = validateFormationImport(result);
    expect(errors.some((e) => e.toLowerCase().includes("título"))).toBe(true);
  });
});
