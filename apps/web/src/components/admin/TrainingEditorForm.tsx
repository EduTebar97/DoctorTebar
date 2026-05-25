import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TrainingCourse } from "@doctor-tebar/shared";
import { ChevronDown, ChevronUp, FileText, ImageUp, Plus, Save, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { trainingFormSchema, type TrainingFormData } from "../../schemas/training.schema";
import { parseFormationMarkdown, validateFormationImport, type ParsedBlock } from "../../utils/formation-parser";
import { adminCreate, adminGet, adminUpdate, uploadMedia } from "../../services/contentService";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function TrainingEditorForm() {
  console.log("[FORMACION ADMIN] Renderizando formulario de formación");
  const { id } = useParams();
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({});

  const { data } = useQuery({
    queryKey: ["admin", "training", id],
    queryFn: () => adminGet<TrainingCourse>("training", id!),
    enabled: Boolean(id)
  });

  const { register, handleSubmit, reset, setValue, watch, control, formState } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: { status: "draft", featured: false, order: 0, blocks: [] }
  });

  const blocks = useFieldArray({ control, name: "blocks" });
  const values = watch();

  const imageUpload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (asset) => {
      console.log("[FORMACION ADMIN] Imagen seleccionada", { url: asset.url });
      setValue("coverImageUrl", asset.url, { shouldDirty: true, shouldValidate: true });
    },
    onError: (error: any) => console.error("[FORMACION ADMIN] Error subiendo imagen", error?.response?.data ?? error?.message ?? error)
  });

  useEffect(() => {
    if (!data) return;
    reset({
      title: data.title,
      description: data.description ?? "",
      coverImageUrl: data.coverImageUrl ?? "",
      blocks: data.blocks?.map((block, bi) => ({
        title: block.title,
        description: block.description ?? "",
        order: block.order ?? bi,
        status: block.status ?? "draft",
        topics: block.topics?.map((topic, ti) => ({
          title: topic.title,
          description: topic.description ?? "",
          content: topic.content ?? "",
          imageUrls: topic.imageUrls ?? [],
          videoUrl: topic.videoUrl ?? "",
          order: topic.order ?? ti,
          status: topic.status ?? "draft"
        })) ?? []
      })) ?? [],
      status: data.status,
      featured: data.featured,
      order: data.order ?? 0
    });
    const expanded: Record<number, boolean> = {};
    data.blocks?.forEach((_: unknown, i: number) => { expanded[i] = true; });
    setExpandedBlocks(expanded);
  }, [data, reset]);

  async function save(formValues: TrainingFormData) {
    console.log("[FORMACION ADMIN] Submit de formulario detectado");
    console.log("[FORMACION ADMIN] Validando formulario");
    console.log("[FORMACION ADMIN] Título formación presente:", formValues.title ? "sí" : "no");
    console.log("[FORMACION ADMIN] Bloques presentes:", formValues.blocks?.length ?? 0);
    console.log("[FORMACION ADMIN] Estado actual del formulario", { status: formValues.status });
    console.log("[FORMACION ADMIN] Payload preparado para guardar", {
      title: formValues.title,
      bloques: formValues.blocks?.length,
      estado: formValues.status
    });
    console.log("[FORMACION ADMIN] Enviando petición de guardado");
    console.log("[FORMACION ADMIN] Endpoint usado:", id ? `/api/admin/training/${id}` : "/api/admin/training");
    console.log("[FORMACION ADMIN] Método usado:", id ? "PUT" : "POST");

    setSaveStatus("saving");
    setSaveError(null);
    try {
      if (id) {
        await adminUpdate("training", id, formValues);
      } else {
        await adminCreate("training", formValues);
      }
      if (formValues.status === "published") {
        console.log("[FORMACION ADMIN] Publicación correcta");
      } else {
        console.log("[FORMACION ADMIN] Guardado correcto");
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      navigate("/admin/training");
    } catch (error: any) {
      console.error("[FORMACION ADMIN] Error guardando", error);
      console.error("[FORMACION ADMIN] Error capturado en try/catch", error?.message);
      setSaveStatus("error");
      const details = error?.response?.data?.details;
      const fieldErrors = details?.fieldErrors ? JSON.stringify(details.fieldErrors, null, 2) : null;
      setSaveError((error?.response?.data?.message ?? error?.message ?? "Error desconocido al guardar") + (fieldErrors ? `: ${fieldErrors}` : ""));
    }
  }

  async function handleSaveDraft() {
    console.log("[FORMACION ADMIN] Click en botón Guardar");
    setValue("status", "draft");
    await handleSubmit(save)();
  }

  async function handlePublish() {
    console.log("[FORMACION ADMIN] Click en botón Publicar");
    setValue("status", "published");
    await handleSubmit(save)();
  }

  function addBlock() {
    const index = blocks.fields.length;
    blocks.append({ title: "Nuevo bloque", description: "", order: index, status: "draft", topics: [] });
    setExpandedBlocks((prev) => ({ ...prev, [index]: true }));
  }

  function toggleBlock(index: number) {
    setExpandedBlocks((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  const isBusy = formState.isSubmitting || imageUpload.isPending || saveStatus === "saving";

  return (
    <form className="editor-form" onSubmit={(e) => { e.preventDefault(); void handleSaveDraft(); }} noValidate>

      {/* Feedback de guardado */}
      {saveStatus === "saving" && <div className="save-feedback saving span-2">Guardando...</div>}
      {saveStatus === "saved" && <div className="save-feedback success span-2">Guardado correctamente.</div>}
      {saveStatus === "error" && (
        <div className="save-feedback error span-2">
          <strong>Error al guardar.</strong>
          {saveError ? <span> {saveError}</span> : null}
        </div>
      )}

      {/* Errores de validación */}
      {Object.keys(formState.errors).length > 0 && (
        <div className="save-feedback error span-2">
          <strong>Faltan datos mínimos:</strong>
          <ul style={{ margin: "4px 0 0 16px" }}>
            {formState.errors.title && <li>{formState.errors.title.message}</li>}
          </ul>
        </div>
      )}

      {/* Metadatos del curso */}
      <label>
        Título <span className="required">*</span>
        <input {...register("title")} placeholder="Ej: Modelos predictivos en investigación clínica" />
        {formState.errors.title && <span className="field-error">{formState.errors.title.message}</span>}
      </label>

      <label>
        Estado
        <select {...register("status")}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
      </label>

      <label className="span-2">
        Descripción
        <textarea rows={6} {...register("description")} placeholder="Descripción general del curso. Puedes pegar texto largo desde Word." />
      </label>

      <label>
        Orden
        <input type="number" {...register("order", { valueAsNumber: true })} />
      </label>

      <label className="checkbox">
        <input type="checkbox" {...register("featured")} /> Destacar esta formación
      </label>

      {/* Imagen destacada */}
      <div className="post-image-field span-2">
        <label>
          Imagen destacada
          <input {...register("coverImageUrl")} placeholder="https://..." />
        </label>
        <label className="upload-inline">
          <span>Subir imagen</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) imageUpload.mutate(file);
              event.target.value = "";
            }}
          />
        </label>
        {imageUpload.isPending ? <p className="field-note">Subiendo imagen...</p> : null}
        {imageUpload.isError ? (
          <ErrorMessage message={(imageUpload.error as any)?.response?.data?.message ?? "No se ha podido subir la imagen."} />
        ) : null}
        {values.coverImageUrl ? <img className="post-image-preview" src={values.coverImageUrl} alt="Vista previa" /> : null}
      </div>

      {/* Bloques */}
      <div className="span-2 admin-panel training-blocks">
        <div className="section-heading">
          <h2>Bloques del curso</h2>
          <Button type="button" className="secondary" onClick={addBlock}>
            <Plus size={18} /> Añadir bloque
          </Button>
        </div>

        {!blocks.fields.length ? (
          <p className="field-note">
            Añade bloques para organizar el contenido. Cada bloque puede tener varios temas.
          </p>
        ) : null}

        {blocks.fields.map((block, blockIndex) => (
          <BlockEditor
            key={block.id}
            blockIndex={blockIndex}
            register={register}
            control={control}
            setValue={setValue}
            watch={watch}
            formState={formState}
            expanded={expandedBlocks[blockIndex] !== false}
            onToggle={() => toggleBlock(blockIndex)}
            onRemove={() => blocks.remove(blockIndex)}
          />
        ))}

        <ImportBlocksPanel
          onImport={(importedBlocks) => {
            const startIndex = blocks.fields.length;
            importedBlocks.forEach((b, i) => {
              blocks.append({ ...b, order: startIndex + i });
              setExpandedBlocks((prev) => ({ ...prev, [startIndex + i]: true }));
            });
          }}
        />
      </div>

      {/* Acciones */}
      <div className="form-actions span-2">
        <Button type="submit" disabled={isBusy}>
          <Save size={18} /> {saveStatus === "saving" ? "Guardando..." : "Guardar borrador"}
        </Button>
        <Button type="button" disabled={isBusy} onClick={handlePublish}>
          <Send size={18} /> {saveStatus === "saving" ? "Publicando..." : "Publicar"}
        </Button>
        <Button type="button" className="secondary" disabled={imageUpload.isPending}
          onClick={() => document.querySelector<HTMLInputElement>(".upload-inline input")?.click()}>
          <ImageUp size={18} /> Subir imagen
        </Button>
      </div>
    </form>
  );
}

// ── Bloque ────────────────────────────────────────────────────────────────────

interface BlockEditorProps {
  blockIndex: number;
  register: any;
  control: any;
  setValue: any;
  watch: any;
  formState: any;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

function BlockEditor({ blockIndex, register, control, setValue, watch, formState, expanded, onToggle, onRemove }: BlockEditorProps) {
  console.log(`[FORMACION ADMIN] Renderizando formulario de bloque ${blockIndex + 1}`);
  const blockTitle = watch(`blocks.${blockIndex}.title`);

  return (
    <div className="training-block-editor">
      <div className="block-header">
        <button type="button" className="block-toggle" onClick={onToggle}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <strong>Bloque {blockIndex + 1}</strong>
          {blockTitle ? <span className="block-title-preview"> — {blockTitle}</span> : null}
        </button>
        <Button type="button" className="danger icon-only" onClick={onRemove}>
          <Trash2 size={16} />
        </Button>
      </div>

      {expanded ? (
        <div className="block-body">
          <label>
            Título del bloque <span className="required">*</span>
            <input {...register(`blocks.${blockIndex}.title`)} placeholder="Ej: Fundamentos de los modelos predictivos" />
            {(formState.errors.blocks as any)?.[blockIndex]?.title && (
              <span className="field-error">{(formState.errors.blocks as any)[blockIndex].title.message}</span>
            )}
          </label>

          <label>
            Orden
            <input type="number" {...register(`blocks.${blockIndex}.order`, { valueAsNumber: true })} />
          </label>

          <label className="span-2">
            Descripción del bloque
            <textarea rows={2} {...register(`blocks.${blockIndex}.description`)} placeholder="Descripción breve del bloque (opcional)" />
          </label>

          <label>
            Estado
            <select {...register(`blocks.${blockIndex}.status`)}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </label>

          <div className="span-2">
            <TopicsEditor blockIndex={blockIndex} register={register} control={control} setValue={setValue} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── Temas ─────────────────────────────────────────────────────────────────────

interface TopicsEditorProps {
  blockIndex: number;
  register: any;
  control: any;
  setValue: any;
}

function TopicsEditor({ blockIndex, register, control, setValue }: TopicsEditorProps) {
  const topics = useFieldArray({ control, name: `blocks.${blockIndex}.topics` });

  function addTopic() {
    topics.append({
      title: "Nuevo tema",
      description: "",
      content: "",
      imageUrls: [],
      videoUrl: "",
      order: topics.fields.length,
      status: "draft"
    });
  }

  return (
    <div className="training-topics">
      <div className="section-heading">
        <h3>Temas del bloque</h3>
        <Button type="button" className="secondary" onClick={addTopic}>
          <Plus size={16} /> Tema
        </Button>
      </div>

      {!topics.fields.length ? (
        <p className="field-note">Añade temas a este bloque.</p>
      ) : null}

      {topics.fields.map((topic, topicIndex) => {
        console.log(`[FORMACION ADMIN] Renderizando formulario de tema ${topicIndex + 1} en bloque ${blockIndex + 1}`);
        return (
          <div className="topic-editor" key={topic.id}>
            <div className="section-heading">
              <h4>Tema {topicIndex + 1}</h4>
              <Button type="button" className="danger icon-only" onClick={() => topics.remove(topicIndex)}>
                <Trash2 size={14} />
              </Button>
            </div>

            <label>
              Título del tema <span className="required">*</span>
              <input
                {...register(`blocks.${blockIndex}.topics.${topicIndex}.title`)}
                placeholder="Ej: Qué es un modelo predictivo"
              />
            </label>

            <label>
              Orden
              <input type="number" {...register(`blocks.${blockIndex}.topics.${topicIndex}.order`, { valueAsNumber: true })} />
            </label>

            <label>
              Estado
              <select {...register(`blocks.${blockIndex}.topics.${topicIndex}.status`)}>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </label>

            <label className="span-2">
              Descripción breve
              <textarea rows={2} {...register(`blocks.${blockIndex}.topics.${topicIndex}.description`)} placeholder="Descripción breve del tema (opcional)" />
            </label>

            <label className="span-2">
              Contenido
              <textarea
                rows={10}
                {...register(`blocks.${blockIndex}.topics.${topicIndex}.content`)}
                placeholder="Pega aquí el texto desde Word o escribe directamente. Se mantienen los párrafos."
              />
            </label>

            <label>
              Vídeo (URL)
              <input
                {...register(`blocks.${blockIndex}.topics.${topicIndex}.videoUrl`)}
                placeholder="https://youtube.com/..."
              />
            </label>

            <TopicImageField
              blockIndex={blockIndex}
              topicIndex={topicIndex}
              control={control}
              setValue={setValue}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Imágenes de tema ──────────────────────────────────────────────────────────

function TopicImageField({
  blockIndex,
  topicIndex,
  control,
  setValue
}: {
  blockIndex: number;
  topicIndex: number;
  control: any;
  setValue: any;
}) {
  const fieldName = `blocks.${blockIndex}.topics.${topicIndex}.imageUrls`;
  const rawValue = useWatch({ control, name: fieldName as any });
  const urls: string[] = Array.isArray(rawValue)
    ? (rawValue as string[]).filter(Boolean)
    : typeof rawValue === "string"
    ? (rawValue as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const imageUpload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (asset) => {
      setValue(fieldName, [...urls, asset.url], { shouldDirty: true });
    },
    onError: (error: any) => console.error("[FORMACION ADMIN] Error subiendo imagen de tema", error?.response?.data ?? error?.message)
  });

  function removeUrl(idx: number) {
    setValue(fieldName, urls.filter((_, i) => i !== idx), { shouldDirty: true });
  }

  function handleUrlInput(e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const url = input.value.trim();
    if (url && !urls.includes(url)) {
      setValue(fieldName, [...urls, url], { shouldDirty: true });
      input.value = "";
    }
  }

  return (
    <div className="topic-images-field span-2">
      <span className="field-label-text">Imágenes del tema</span>

      {urls.length > 0 && (
        <div className="topic-image-previews">
          {urls.map((url, i) => (
            <div key={`${i}-${url.slice(-20)}`} className="topic-image-thumb">
              <img src={url} alt={`Imagen ${i + 1}`} />
              <button type="button" className="remove-img-btn" onClick={() => removeUrl(i)}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="topic-image-actions">
        <label className="upload-inline">
          <ImageUp size={14} style={{ marginRight: 4 }} />
          <span>Subir imagen</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) imageUpload.mutate(file);
              e.target.value = "";
            }}
          />
        </label>
        <input
          type="url"
          className="url-paste-input"
          placeholder="O pega una URL y pulsa Enter"
          onBlur={handleUrlInput}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlInput(e); } }}
        />
      </div>

      {imageUpload.isPending && <p className="field-note">Subiendo imagen...</p>}
      {imageUpload.isError && (
        <p className="field-error">
          {(imageUpload.error as any)?.response?.data?.message ?? "Error al subir la imagen"}
        </p>
      )}
    </div>
  );
}

// ── Importar bloques desde documento ─────────────────────────────────────────

interface ImportBlocksPanelProps {
  onImport: (blocks: ParsedBlock[]) => void;
}

function ImportBlocksPanel({ onImport }: ImportBlocksPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsedBlocks, setParsedBlocks] = useState<ParsedBlock[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [imported, setImported] = useState(false);

  function reset() {
    setParsedBlocks([]);
    setErrors([]);
    setFileName("");
    setImported(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file: File) {
    if (!file.name.endsWith(".md")) {
      setErrors(["El archivo debe tener extensión .md"]);
      setParsedBlocks([]);
      setFileName(file.name);
      return;
    }
    setFileName(file.name);
    setImported(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseFormationMarkdown(text);
      const errs = validateFormationImport(result, { requireMetadata: false });
      setParsedBlocks(result.blocks);
      setErrors(errs);
    };
    reader.readAsText(file, "utf-8");
  }

  function handleConfirm() {
    onImport(parsedBlocks);
    setImported(true);
    setTimeout(() => {
      setOpen(false);
      reset();
    }, 1500);
  }

  const canImport = errors.length === 0 && parsedBlocks.length > 0 && !imported;

  return (
    <div className="import-blocks-panel">
      <button
        type="button"
        className="import-blocks-toggle"
        onClick={() => { setOpen((v) => !v); if (open) reset(); }}
      >
        <FileText size={15} />
        <span>Añadir bloques desde documento</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="import-blocks-body">
          <label
            className="import-blocks-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            tabIndex={0}
            role="button"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
            {fileName
              ? <span className="import-blocks-filename"><FileText size={13} /> {fileName}</span>
              : <span className="field-note">Selecciona un archivo <strong>.md</strong> con bloques y temas</span>
            }
          </label>

          {errors.length > 0 && (
            <ul className="import-error-list" style={{ marginTop: 8 }}>
              {errors.map((err, i) => <li key={i} className="import-error-item">{err}</li>)}
            </ul>
          )}

          {parsedBlocks.length > 0 && errors.length === 0 && !imported && (
            <div className="import-blocks-preview">
              <p className="field-note">
                Se añadirán <strong>{parsedBlocks.length} bloque{parsedBlocks.length !== 1 ? "s" : ""}</strong> con{" "}
                <strong>{parsedBlocks.reduce((a, b) => a + b.topics.length, 0)} temas</strong> en total.
              </p>
              <ul className="import-blocks-list-preview">
                {parsedBlocks.map((b, i) => (
                  <li key={i}>
                    <strong>{b.title}</strong>
                    <span className="import-topic-count"> ({b.topics.length} tema{b.topics.length !== 1 ? "s" : ""})</span>
                  </li>
                ))}
              </ul>
              <div className="form-actions" style={{ marginTop: 12 }}>
                <Button type="button" disabled={!canImport} onClick={handleConfirm}>
                  Añadir bloques al curso
                </Button>
                <Button type="button" className="secondary" onClick={reset}>
                  Limpiar
                </Button>
              </div>
            </div>
          )}

          {imported && (
            <p className="save-feedback success" style={{ marginTop: 8 }}>
              Bloques añadidos correctamente. Guarda el curso para conservarlos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
