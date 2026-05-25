export interface FormationMetadata {
  title: string;
  description: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  order: number;
  coverImageUrl: string;
}

export interface ParsedTopic {
  title: string;
  description: string;
  content: string;
  order: number;
  status: "draft" | "published";
  imageUrls: string[];
  videoUrl: string;
}

export interface ParsedBlock {
  title: string;
  description: string;
  order: number;
  status: "draft" | "published";
  topics: ParsedTopic[];
}

export interface ParsedFormation {
  metadata: FormationMetadata;
  blocks: ParsedBlock[];
  errors: string[];
}

// ── Simple YAML key-value parser ──────────────────────────────────────────────

function parseYaml(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    if (!key || key.includes(" ")) continue; // skip non-simple keys
    const rawValue = trimmed.slice(colonIdx + 1).trim();
    // Remove surrounding quotes (single or double)
    const value = rawValue.replace(/^["'](.*)["']$/, "$1").trim();
    result[key] = value;
  }
  return result;
}

// ── Main parser ───────────────────────────────────────────────────────────────

type ParseState =
  | "init"
  | "block_desc"
  | "topic_init"
  | "topic_desc"
  | "topic_content";

export function parseFormationMarkdown(text: string): ParsedFormation {
  const metadata: FormationMetadata = {
    title: "",
    description: "",
    status: "draft",
    featured: false,
    order: 0,
    coverImageUrl: ""
  };

  const blocks: ParsedBlock[] = [];
  const errors: string[] = [];

  // ── Extract YAML frontmatter ────────────────────────────────────────────────
  let bodyText = text.trim();
  const yamlMatch = bodyText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);

  if (yamlMatch) {
    const yaml = parseYaml(yamlMatch[1]);
    if (yaml.title) metadata.title = yaml.title;
    if (yaml.description) metadata.description = yaml.description;
    if (yaml.status && ["draft", "published", "archived"].includes(yaml.status)) {
      metadata.status = yaml.status as FormationMetadata["status"];
    }
    bodyText = yamlMatch[2] ?? "";
  }

  // ── State machine ──────────────────────────────────────────────────────────
  let state: ParseState = "init";
  let currentBlock: ParsedBlock | null = null;
  let currentTopic: ParsedTopic | null = null;
  let buffer = "";

  function flushTopic() {
    if (!currentTopic || !currentBlock) return;
    if (state === "topic_content") currentTopic.content = buffer.trim();
    else if (state === "topic_desc") currentTopic.description = buffer.trim();
    currentBlock.topics.push({ ...currentTopic });
    currentTopic = null;
    buffer = "";
  }

  function flushBlock() {
    if (!currentBlock) return;
    if (state === "block_desc") currentBlock.description = buffer.trim();
    blocks.push({ ...currentBlock, topics: currentBlock.topics });
    currentBlock = null;
    buffer = "";
  }

  const lines = bodyText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    // ── # Bloque: Title ─────────────────────────────────────────────────────
    const blockMatch = trimmed.match(/^# Bloque:\s*(.+)$/i);
    if (blockMatch) {
      flushTopic();
      if (state === "block_desc" && currentBlock) {
        currentBlock.description = buffer.trim();
      }
      flushBlock();

      currentBlock = {
        title: blockMatch[1].trim(),
        description: "",
        order: blocks.length,
        status: "draft",
        topics: []
      };
      state = "block_desc";
      buffer = "";
      continue;
    }

    // ── ## Descripción del bloque ───────────────────────────────────────────
    if (/^## Descripci[oó]n del bloque\s*$/i.test(trimmed)) {
      if (currentBlock && state === "block_desc") {
        // Already in block_desc, just reset buffer (might have been double header)
        buffer = "";
      }
      state = "block_desc";
      buffer = "";
      continue;
    }

    // ── ## Tema: Title ──────────────────────────────────────────────────────
    const topicMatch = trimmed.match(/^## Tema:\s*(.+)$/i);
    if (topicMatch) {
      if (!currentBlock) {
        errors.push(`Error: el tema "${topicMatch[1].trim()}" aparece antes de definir un bloque`);
        continue;
      }
      // Save block description if we're still in block_desc
      if (state === "block_desc") {
        currentBlock.description = buffer.trim();
      }
      flushTopic();

      currentTopic = {
        title: topicMatch[1].trim(),
        description: "",
        content: "",
        order: currentBlock.topics.length,
        status: "draft",
        imageUrls: [],
        videoUrl: ""
      };
      state = "topic_init";
      buffer = "";
      continue;
    }

    // ── ### Descripción del tema ────────────────────────────────────────────
    if (/^### Descripci[oó]n del tema\s*$/i.test(trimmed)) {
      state = "topic_desc";
      buffer = "";
      continue;
    }

    // ── ### Contenido ───────────────────────────────────────────────────────
    if (/^### Contenido\s*$/i.test(trimmed)) {
      if (currentTopic && state === "topic_desc") {
        currentTopic.description = buffer.trim();
      }
      state = "topic_content";
      buffer = "";
      continue;
    }

    // ── Accumulate text ─────────────────────────────────────────────────────
    if (state === "block_desc" || state === "topic_desc" || state === "topic_content") {
      // Skip leading blank lines at the start of a new buffer
      if (buffer === "" && trimmed === "") continue;
      buffer += line + "\n";
    }
  }

  // ── Finalize last topic and block ──────────────────────────────────────────
  flushTopic();
  if (state === "block_desc" && currentBlock) {
    currentBlock.description = buffer.trim();
  }
  flushBlock();

  return { metadata, blocks, errors };
}

// ── Validator ─────────────────────────────────────────────────────────────────

interface ValidateOptions {
  requireMetadata?: boolean; // default: true — set false for append-only mode
}

export function validateFormationImport(
  parsed: ParsedFormation,
  options: ValidateOptions = {}
): string[] {
  const { requireMetadata = true } = options;
  const errors: string[] = [...parsed.errors];

  if (requireMetadata) {
    if (!parsed.metadata.title.trim()) {
      errors.push("Error: falta el título de la formación en los metadatos YAML");
    }
    if (!parsed.metadata.description.trim()) {
      errors.push("Error: falta la descripción de la formación en los metadatos YAML");
    }
  }

  if (parsed.blocks.length === 0) {
    errors.push("Error: el documento no contiene ningún bloque");
    return errors;
  }

  parsed.blocks.forEach((block, bi) => {
    const blockLabel = block.title
      ? `Bloque ${bi + 1} ("${block.title}")`
      : `Bloque ${bi + 1}`;

    if (!block.title.trim()) {
      errors.push(`Error: el bloque ${bi + 1} no tiene título`);
    }
    if (!block.description.trim()) {
      errors.push(`Error: el ${blockLabel} no tiene descripción`);
    }
    if (block.topics.length === 0) {
      errors.push(`Error: el ${blockLabel} no tiene ningún tema`);
    }

    block.topics.forEach((topic, ti) => {
      const topicLabel = topic.title
        ? `tema ${ti + 1} ("${topic.title}") del ${blockLabel}`
        : `tema ${ti + 1} del ${blockLabel}`;

      if (!topic.title.trim()) {
        errors.push(`Error: el tema ${ti + 1} del ${blockLabel} no tiene título`);
      }
      if (!topic.description.trim()) {
        errors.push(`Error: el ${topicLabel} no tiene descripción`);
      }
      if (!topic.content.trim()) {
        errors.push(`Error: el ${topicLabel} no tiene contenido`);
      }
    });
  });

  return errors;
}
