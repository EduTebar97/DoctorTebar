import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TrainingCourse } from "@doctor-tebar/shared";
import {
  BookOpen, ChevronDown, ChevronRight, ChevronUp, EyeOff, FileText,
  FolderOpen, ImageUp, Info, Plus, RefreshCw, Save, Send, Settings, Trash2, X
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { trainingFormSchema, type TrainingFormData } from "../../schemas/training.schema";
import { parseFormationMarkdown, validateFormationImport, type ParsedBlock } from "../../utils/formation-parser";
import { adminCreate, adminGet, adminUpdate, uploadMedia } from "../../services/contentService";
import { Button } from "../common/Button";
import { ErrorMessage } from "../common/ErrorMessage";
import { RichTextEditor } from "./RichTextEditor";

// ── Auto-resize textarea ───────────────────────────────────────────────────────
const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function AutoResizeTextareaInner(props, forwardedRef) {
    const localRef = useRef<HTMLTextAreaElement>(null);

    function setRef(el: HTMLTextAreaElement | null) {
      (localRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    }

    function resize() {
      const el = localRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight + 2}px`;
    }

    useEffect(() => { resize(); });

    return (
      <textarea
        {...props}
        ref={setRef}
        rows={1}
        style={{ ...props.style, resize: "none", overflow: "hidden", minHeight: "44px" }}
      />
    );
  }
);

// ── Learning objectives editor ─────────────────────────────────────────────────
function ObjectivesEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="objectives-editor">
      {value.map((obj, i) => (
        <div key={i} className="objective-row">
          <input
            className="objective-input"
            value={obj}
            onChange={(e) => { const next = [...value]; next[i] = e.target.value; onChange(next); }}
            placeholder={`Objetivo ${i + 1}: el alumno será capaz de…`}
          />
          <button type="button" className="icon-btn danger" onClick={() => onChange(value.filter((_, j) => j !== i))} title="Eliminar objetivo">
            <X size={14} />
          </button>
        </div>
      ))}
      <button type="button" className="tree-add-btn" style={{ marginTop: 4 }} onClick={() => onChange([...value, ""])}>
        <Plus size={13} /> Añadir objetivo
      </button>
    </div>
  );
}

type SaveStatus = "idle" | "saving" | "saved" | "error";
type SelectedNode =
  | { type: "root" }
  | { type: "block"; blockIndex: number }
  | { type: "topic"; blockIndex: number; topicIndex: number };

// ── Main component ─────────────────────────────────────────────────────────────

export function TrainingEditorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedNode>({ type: "root" });
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({});

  const { data } = useQuery({
    queryKey: ["admin", "training", id],
    queryFn: () => adminGet<TrainingCourse>("training", id!),
    enabled: Boolean(id)
  });

  const { register, handleSubmit, reset, setValue, watch, control, formState } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: { status: "draft", featured: false, order: 0, blocks: [], learningObjectives: [] }
  });

  const blocks = useFieldArray({ control, name: "blocks" });
  const values = watch();

  const imageUpload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (asset) => setValue("coverImageUrl", asset.url, { shouldDirty: true, shouldValidate: true }),
    onError: (error: any) => console.error("[FORMACION ADMIN] Error subiendo imagen", error?.response?.data ?? error?.message)
  });

  useEffect(() => {
    if (!data) return;
    reset({
      title: data.title,
      description: data.description ?? "",
      learningObjectives: data.learningObjectives ?? [],
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
    setSaveStatus("saving");
    setSaveError(null);
    try {
      if (id) await adminUpdate("training", id, formValues);
      else await adminCreate("training", formValues);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      navigate("/admin/training");
    } catch (error: any) {
      setSaveStatus("error");
      const details = error?.response?.data?.details;
      const fieldErrors = details?.fieldErrors ? JSON.stringify(details.fieldErrors, null, 2) : null;
      setSaveError((error?.response?.data?.message ?? error?.message ?? "Error desconocido al guardar") + (fieldErrors ? `: ${fieldErrors}` : ""));
    }
  }

  async function handleSaveDraft() {
    setValue("status", "draft");
    await handleSubmit(save)();
  }

  async function handlePublish() {
    setValue("status", "published");
    await handleSubmit(save)();
  }

  function addBlock() {
    const index = blocks.fields.length;
    blocks.append({ title: "Nuevo bloque", description: "", order: index, status: "draft", topics: [] });
    setExpandedBlocks((prev) => ({ ...prev, [index]: true }));
    setSelected({ type: "block", blockIndex: index });
  }

  const isBusy = formState.isSubmitting || imageUpload.isPending || saveStatus === "saving";
  const isPublished = values.status === "published";

  return (
    <form className="editor-form training-tree-form" onSubmit={(e) => { e.preventDefault(); void handleSaveDraft(); }} noValidate>

      {/* Status feedback */}
      {saveStatus === "saving" && <div className="save-feedback saving span-full">Guardando...</div>}
      {saveStatus === "saved" && <div className="save-feedback success span-full">Guardado correctamente.</div>}
      {saveStatus === "error" && (
        <div className="save-feedback error span-full">
          <strong>Error al guardar.</strong>
          {saveError ? <span> {saveError}</span> : null}
        </div>
      )}
      {Object.keys(formState.errors).length > 0 && (
        <div className="save-feedback error span-full">
          <strong>Faltan datos mínimos:</strong>
          <ul style={{ margin: "4px 0 0 16px" }}>
            {formState.errors.title && <li>{formState.errors.title.message}</li>}
          </ul>
        </div>
      )}

      {/* Action bar */}
      <div className="training-action-bar span-full">
        {isPublished ? (
          <>
            <Button type="button" disabled={isBusy} onClick={() => void handleSubmit(save)()}>
              <RefreshCw size={16} /> {saveStatus === "saving" ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button type="button" className="secondary" disabled={isBusy} onClick={async () => { setValue("status", "draft"); await handleSubmit(save)(); }}>
              <EyeOff size={16} /> Deshacer publicación
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" disabled={isBusy}>
              <Save size={16} /> {saveStatus === "saving" ? "Guardando..." : "Guardar borrador"}
            </Button>
            <Button type="button" disabled={isBusy} onClick={handlePublish}>
              <Send size={16} /> {saveStatus === "saving" ? "Publicando..." : "Publicar"}
            </Button>
          </>
        )}
        <Button type="button" className="secondary" disabled={imageUpload.isPending}
          onClick={() => document.querySelector<HTMLInputElement>(".training-tree-form .upload-inline input")?.click()}>
          <ImageUp size={16} /> Subir imagen
        </Button>
      </div>

      {/* Two-column layout: tree + editor */}
      <div className="training-tree-layout span-full">
        {/* Left: Tree panel */}
        <aside className="training-tree-panel">
          <div className="tree-header">Estructura</div>

          {/* Root node */}
          <button
            type="button"
            className={`tree-node tree-root${selected.type === "root" ? " active" : ""}`}
            onClick={() => setSelected({ type: "root" })}
          >
            <Info size={14} />
            <span>{values.title || "Formación"}</span>
          </button>

          {/* Block nodes */}
          {blocks.fields.map((field, bi) => {
            const blockTitle = values.blocks?.[bi]?.title || `Bloque ${bi + 1}`;
            const isExpanded = expandedBlocks[bi] !== false;
            const topics = values.blocks?.[bi]?.topics ?? [];

            return (
              <div key={field.id} className="tree-block-group">
                <div className={`tree-node tree-block${selected.type === "block" && selected.blockIndex === bi ? " active" : ""}`}>
                  <button
                    type="button"
                    className="tree-expand-btn"
                    onClick={() => setExpandedBlocks((p) => ({ ...p, [bi]: !p[bi] }))}
                    aria-label={isExpanded ? "Colapsar bloque" : "Expandir bloque"}
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                  <button
                    type="button"
                    className="tree-node-label"
                    onClick={() => setSelected({ type: "block", blockIndex: bi })}
                  >
                    <FolderOpen size={14} />
                    <span>{blockTitle}</span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="tree-topics">
                    {topics.map((topic: any, ti: number) => (
                      <button
                        key={`${bi}-${ti}`}
                        type="button"
                        className={`tree-node tree-topic${selected.type === "topic" && selected.blockIndex === bi && selected.topicIndex === ti ? " active" : ""}`}
                        onClick={() => setSelected({ type: "topic", blockIndex: bi, topicIndex: ti })}
                      >
                        <BookOpen size={12} />
                        <span>{topic.title || `Tema ${ti + 1}`}</span>
                      </button>
                    ))}
                    <TreeAddTopicButton
                      blockIndex={bi}
                      control={control}
                      onAdded={(ti) => setSelected({ type: "topic", blockIndex: bi, topicIndex: ti })}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Add block button */}
          <button type="button" className="tree-add-btn tree-add-block" onClick={addBlock}>
            <Plus size={13} /> Añadir bloque
          </button>

          {/* Import panel */}
          <ImportBlocksPanel
            onImport={(importedBlocks) => {
              const startIndex = blocks.fields.length;
              importedBlocks.forEach((b, i) => {
                blocks.append({ ...b, order: startIndex + i });
                setExpandedBlocks((prev) => ({ ...prev, [startIndex + i]: true }));
              });
            }}
          />
        </aside>

        {/* Right: Editor area */}
        <div className="training-editor-area">
          {selected.type === "root" && (
            <RootEditor
              register={register}
              formState={formState}
              watch={watch}
              control={control}
              setValue={setValue}
              imageUpload={imageUpload}
              blocks={blocks}
              addBlock={addBlock}
              setSelected={setSelected}
            />
          )}
          {selected.type === "block" && (
            <BlockEditor
              blockIndex={selected.blockIndex}
              register={register}
              control={control}
              watch={watch}
              formState={formState}
              onRemove={() => {
                blocks.remove(selected.blockIndex);
                setSelected({ type: "root" });
              }}
              onSelectTopic={(ti) => setSelected({ type: "topic", blockIndex: selected.blockIndex, topicIndex: ti })}
              onAddTopic={(ti) => setSelected({ type: "topic", blockIndex: selected.blockIndex, topicIndex: ti })}
            />
          )}
          {selected.type === "topic" && (
            <TopicEditor
              blockIndex={selected.blockIndex}
              topicIndex={selected.topicIndex}
              register={register}
              control={control}
              setValue={setValue}
              formState={formState}
              onRemove={() => {
                setSelected({ type: "block", blockIndex: selected.blockIndex });
              }}
            />
          )}
        </div>
      </div>
    </form>
  );
}

// ── Tree helpers ───────────────────────────────────────────────────────────────

function TreeAddTopicButton({ blockIndex, control, onAdded }: { blockIndex: number; control: any; onAdded: (ti: number) => void }) {
  const topics = useFieldArray({ control, name: `blocks.${blockIndex}.topics` as any });
  return (
    <button
      type="button"
      className="tree-add-btn tree-add-topic"
      onClick={() => {
        const ti = topics.fields.length;
        topics.append({ title: "Nuevo tema", description: "", content: "", imageUrls: [], videoUrl: "", order: ti, status: "draft" });
        onAdded(ti);
      }}
    >
      <Plus size={11} /> Añadir tema
    </button>
  );
}

// ── Root editor ────────────────────────────────────────────────────────────────

interface RootEditorProps {
  register: any; formState: any; watch: any; control: any; setValue: any; imageUpload: any;
  blocks: any; addBlock: () => void; setSelected: (n: SelectedNode) => void;
}

function RootEditor({ register, formState, watch, control, imageUpload, blocks, addBlock, setSelected }: RootEditorProps) {
  const [tab, setTab] = useState<"info" | "org" | "pub">("info");
  const values = watch();

  return (
    <div className="editor-unit">
      <div className="editor-unit-header">
        <span className="editor-unit-type"><Info size={14} /> Formación</span>
        <h2 className="editor-unit-title">{values.title || "Sin título"}</h2>
      </div>
      <div className="editor-tabs">
        <button type="button" className={`editor-tab${tab === "info" ? " active" : ""}`} onClick={() => setTab("info")}>
          <Info size={13} /> Información general
        </button>
        <button type="button" className={`editor-tab${tab === "org" ? " active" : ""}`} onClick={() => setTab("org")}>
          <FolderOpen size={13} /> Organización
        </button>
        <button type="button" className={`editor-tab${tab === "pub" ? " active" : ""}`} onClick={() => setTab("pub")}>
          <Settings size={13} /> Publicación
        </button>
      </div>

      {tab === "info" && (
        <div className="editor-tab-content">
          <label>
            Título <span className="required">*</span>
            <input {...register("title")} placeholder="Ej: Modelos predictivos en investigación clínica" />
            {formState.errors.title && <span className="field-error">{formState.errors.title.message}</span>}
          </label>
          <label className="span-2">
            Descripción
            <AutoResizeTextarea {...register("description")} placeholder="Descripción general del curso." />
          </label>
          <div className="span-2">
            <label style={{ display: "block", marginBottom: 6 }}>Objetivos de aprendizaje</label>
            <p className="field-note" style={{ marginBottom: 8 }}>¿Qué será capaz de hacer el alumno al terminar? Añade uno por línea.</p>
            <Controller
              control={control}
              name="learningObjectives"
              render={({ field }) => (
                <ObjectivesEditor value={field.value ?? []} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="post-image-field span-2">
            <label>
              Imagen destacada
              <input {...register("coverImageUrl")} placeholder="https://..." />
            </label>
            <label className="upload-inline">
              <span>Subir imagen</span>
              <input type="file" accept="image/png,image/jpeg,image/webp"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) imageUpload.mutate(f); e.target.value = ""; }} />
            </label>
            {imageUpload.isPending ? <p className="field-note">Subiendo imagen...</p> : null}
            {imageUpload.isError ? <ErrorMessage message={(imageUpload.error as any)?.response?.data?.message ?? "No se ha podido subir la imagen."} /> : null}
            {values.coverImageUrl ? <img className="post-image-preview" src={values.coverImageUrl} alt="Vista previa" /> : null}
          </div>
          <label>
            Orden
            <input type="number" {...register("order", { valueAsNumber: true })} />
          </label>
        </div>
      )}

      {tab === "org" && (
        <div className="editor-tab-content">
          <div className="editor-block-list">
            {blocks.fields.length === 0 ? (
              <p className="field-note">No hay bloques todavía. Añade el primero para empezar.</p>
            ) : (
              blocks.fields.map((_: any, bi: number) => {
                const blockTitle = values.blocks?.[bi]?.title || `Bloque ${bi + 1}`;
                const topicCount = values.blocks?.[bi]?.topics?.length ?? 0;
                return (
                  <div key={bi} className="block-list-item">
                    <FolderOpen size={15} />
                    <span className="block-list-title">{blockTitle}</span>
                    <span className="block-list-meta">{topicCount} tema{topicCount !== 1 ? "s" : ""}</span>
                    <button type="button" className="btn secondary" style={{ padding: "6px 10px", fontSize: 12 }}
                      onClick={() => setSelected({ type: "block", blockIndex: bi })}>
                      Editar
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <Button type="button" className="secondary" onClick={addBlock} style={{ marginTop: 12 }}>
            <Plus size={15} /> Añadir bloque
          </Button>
        </div>
      )}

      {tab === "pub" && (
        <div className="editor-tab-content">
          <label>
            Estado
            <select {...register("status")}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" {...register("featured")} /> Destacar esta formación
          </label>
        </div>
      )}
    </div>
  );
}

// ── Block editor ───────────────────────────────────────────────────────────────

interface BlockEditorProps {
  blockIndex: number; register: any; control: any; watch: any; formState: any;
  onRemove: () => void;
  onSelectTopic: (ti: number) => void;
  onAddTopic: (ti: number) => void;
}

function BlockEditor({ blockIndex, register, control, watch, formState, onRemove, onSelectTopic, onAddTopic }: BlockEditorProps) {
  const [tab, setTab] = useState<"info" | "topics">("info");
  const topics = useFieldArray({ control, name: `blocks.${blockIndex}.topics` as any });
  const values = watch();
  const blockTitle = values.blocks?.[blockIndex]?.title || `Bloque ${blockIndex + 1}`;

  return (
    <div className="editor-unit">
      <div className="editor-unit-header">
        <span className="editor-unit-type"><FolderOpen size={14} /> Bloque {blockIndex + 1}</span>
        <h2 className="editor-unit-title">{blockTitle}</h2>
        <Button type="button" className="danger icon-only" onClick={onRemove} title="Eliminar bloque">
          <Trash2 size={15} />
        </Button>
      </div>
      <div className="editor-tabs">
        <button type="button" className={`editor-tab${tab === "info" ? " active" : ""}`} onClick={() => setTab("info")}>
          <Info size={13} /> Información del bloque
        </button>
        <button type="button" className={`editor-tab${tab === "topics" ? " active" : ""}`} onClick={() => setTab("topics")}>
          <BookOpen size={13} /> Temas del bloque ({topics.fields.length})
        </button>
      </div>

      {tab === "info" && (
        <div className="editor-tab-content">
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
          <label>
            Estado
            <select {...register(`blocks.${blockIndex}.status`)}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </label>
          <label className="span-2">
            Descripción del bloque
            <AutoResizeTextarea {...register(`blocks.${blockIndex}.description`)} placeholder="Descripción breve del bloque (opcional)" />
          </label>
        </div>
      )}

      {tab === "topics" && (
        <div className="editor-tab-content">
          {topics.fields.length === 0 ? (
            <p className="field-note">No hay temas en este bloque. Añade el primero.</p>
          ) : (
            <div className="editor-block-list">
              {topics.fields.map((_: any, ti: number) => {
                const topicTitle = values.blocks?.[blockIndex]?.topics?.[ti]?.title || `Tema ${ti + 1}`;
                return (
                  <div key={ti} className="block-list-item">
                    <BookOpen size={13} />
                    <span className="block-list-title">{topicTitle}</span>
                    <button type="button" className="btn secondary" style={{ padding: "6px 10px", fontSize: 12 }}
                      onClick={() => onSelectTopic(ti)}>
                      Editar
                    </button>
                    <Button type="button" className="danger icon-only" style={{ width: 32, minHeight: 32 }}
                      onClick={() => { topics.remove(ti); }}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <Button type="button" className="secondary" style={{ marginTop: 12 }}
            onClick={() => {
              const ti = topics.fields.length;
              topics.append({ title: "Nuevo tema", description: "", content: "", imageUrls: [], videoUrl: "", order: ti, status: "draft" });
              onAddTopic(ti);
            }}>
            <Plus size={15} /> Añadir tema
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Topic editor ───────────────────────────────────────────────────────────────

interface TopicEditorProps {
  blockIndex: number; topicIndex: number; register: any; control: any; setValue: any; formState: any;
  onRemove: () => void;
}

function TopicEditor({ blockIndex, topicIndex, register, control, setValue: _setValue, onRemove }: TopicEditorProps) {
  const [tab, setTab] = useState<"info" | "content" | "resources">("info");
  const topics = useFieldArray({ control, name: `blocks.${blockIndex}.topics` as any });
  const topicWatch = useWatch({ control, name: `blocks.${blockIndex}.topics.${topicIndex}` as any });
  const topicTitle = topicWatch?.title || `Tema ${topicIndex + 1}`;

  function handleRemove() {
    topics.remove(topicIndex);
    onRemove();
  }

  return (
    <div className="editor-unit">
      <div className="editor-unit-header">
        <span className="editor-unit-type"><BookOpen size={14} /> Tema {topicIndex + 1}</span>
        <h2 className="editor-unit-title">{topicTitle}</h2>
        <Button type="button" className="danger icon-only" onClick={handleRemove} title="Eliminar tema">
          <Trash2 size={15} />
        </Button>
      </div>
      <div className="editor-tabs">
        <button type="button" className={`editor-tab${tab === "info" ? " active" : ""}`} onClick={() => setTab("info")}>
          <Info size={13} /> Información básica
        </button>
        <button type="button" className={`editor-tab${tab === "content" ? " active" : ""}`} onClick={() => setTab("content")}>
          <FileText size={13} /> Contenido
        </button>
        <button type="button" className={`editor-tab${tab === "resources" ? " active" : ""}`} onClick={() => setTab("resources")}>
          <ImageUp size={13} /> Recursos
        </button>
      </div>

      {tab === "info" && (
        <div className="editor-tab-content">
          <label>
            Título del tema <span className="required">*</span>
            <input {...register(`blocks.${blockIndex}.topics.${topicIndex}.title`)} placeholder="Ej: Qué es un modelo predictivo" />
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
            <AutoResizeTextarea {...register(`blocks.${blockIndex}.topics.${topicIndex}.description`)} placeholder="Descripción breve del tema (opcional)" />
          </label>
        </div>
      )}

      {tab === "content" && (
        <div className="editor-tab-content">
          <div className="span-2 rte-field-wrap">
            <span className="field-label-text">Contenido del tema</span>
            <Controller
              control={control}
              name={`blocks.${blockIndex}.topics.${topicIndex}.content` as any}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  onUploadImage={async (file) => { const asset = await uploadMedia(file); return asset.url; }}
                  placeholder="Escribe el contenido del tema aquí..."
                />
              )}
            />
          </div>
        </div>
      )}

      {tab === "resources" && (
        <div className="editor-tab-content">
          <label>
            Vídeo (URL)
            <input {...register(`blocks.${blockIndex}.topics.${topicIndex}.videoUrl`)} placeholder="https://youtube.com/..." />
          </label>
          <TopicImageField blockIndex={blockIndex} topicIndex={topicIndex} control={control} setValue={_setValue} />
        </div>
      )}
    </div>
  );
}

// ── Topic image field ──────────────────────────────────────────────────────────

function TopicImageField({ blockIndex, topicIndex, control, setValue }: { blockIndex: number; topicIndex: number; control: any; setValue: any }) {
  const fieldName = `blocks.${blockIndex}.topics.${topicIndex}.imageUrls`;
  const rawValue = useWatch({ control, name: fieldName as any });
  const urls: string[] = Array.isArray(rawValue)
    ? (rawValue as string[]).filter(Boolean)
    : typeof rawValue === "string"
    ? (rawValue as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const imageUpload = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (asset) => setValue(fieldName, [...urls, asset.url], { shouldDirty: true }),
    onError: (error: any) => console.error("[FORMACION ADMIN] Error subiendo imagen de tema", error?.response?.data ?? error?.message)
  });

  function removeUrl(idx: number) { setValue(fieldName, urls.filter((_, i) => i !== idx), { shouldDirty: true }); }

  function handleUrlInput(e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const url = input.value.trim();
    if (url && !urls.includes(url)) { setValue(fieldName, [...urls, url], { shouldDirty: true }); input.value = ""; }
  }

  return (
    <div className="topic-images-field span-2">
      <span className="field-label-text">Imágenes del tema</span>
      {urls.length > 0 && (
        <div className="topic-image-previews">
          {urls.map((url, i) => (
            <div key={`${i}-${url.slice(-20)}`} className="topic-image-thumb">
              <img src={url} alt={`Imagen ${i + 1}`} />
              <button type="button" className="remove-img-btn" onClick={() => removeUrl(i)}><Trash2 size={11} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="topic-image-actions">
        <label className="upload-inline">
          <ImageUp size={14} style={{ marginRight: 4 }} />
          <span>Subir imagen</span>
          <input type="file" accept="image/png,image/jpeg,image/webp"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) imageUpload.mutate(f); e.target.value = ""; }} />
        </label>
        <input type="url" className="url-paste-input" placeholder="O pega una URL y pulsa Enter"
          onBlur={handleUrlInput}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlInput(e); } }} />
      </div>
      {imageUpload.isPending && <p className="field-note">Subiendo imagen...</p>}
      {imageUpload.isError && <p className="field-error">{(imageUpload.error as any)?.response?.data?.message ?? "Error al subir la imagen"}</p>}
    </div>
  );
}

// ── Import blocks panel ────────────────────────────────────────────────────────

interface ImportBlocksPanelProps { onImport: (blocks: ParsedBlock[]) => void; }

function ImportBlocksPanel({ onImport }: ImportBlocksPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsedBlocks, setParsedBlocks] = useState<ParsedBlock[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [imported, setImported] = useState(false);

  function resetState() {
    setParsedBlocks([]); setErrors([]); setFileName(""); setImported(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file: File) {
    if (!file.name.endsWith(".md")) { setErrors(["El archivo debe tener extensión .md"]); setParsedBlocks([]); setFileName(file.name); return; }
    setFileName(file.name); setImported(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseFormationMarkdown(text);
      const errs = validateFormationImport(result, { requireMetadata: false });
      setParsedBlocks(result.blocks); setErrors(errs);
    };
    reader.readAsText(file, "utf-8");
  }

  function handleConfirm() {
    onImport(parsedBlocks); setImported(true);
    setTimeout(() => { setOpen(false); resetState(); }, 1500);
  }

  const canImport = errors.length === 0 && parsedBlocks.length > 0 && !imported;

  return (
    <div className="import-blocks-panel" style={{ marginTop: 8 }}>
      <button type="button" className="import-blocks-toggle"
        onClick={() => { setOpen((v) => !v); if (open) resetState(); }}>
        <FileText size={15} />
        <span>Importar desde documento</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="import-blocks-body">
          <label className="import-blocks-dropzone" onClick={() => fileInputRef.current?.click()} tabIndex={0} role="button"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}>
            <input ref={fileInputRef} type="file" accept=".md" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
            {fileName ? <span className="import-blocks-filename"><FileText size={13} /> {fileName}</span>
              : <span className="field-note">Selecciona un archivo <strong>.md</strong> con bloques y temas</span>}
          </label>
          {errors.length > 0 && <ul className="import-error-list" style={{ marginTop: 8 }}>{errors.map((e, i) => <li key={i} className="import-error-item">{e}</li>)}</ul>}
          {parsedBlocks.length > 0 && errors.length === 0 && !imported && (
            <div className="import-blocks-preview">
              <p className="field-note">Se añadirán <strong>{parsedBlocks.length} bloque{parsedBlocks.length !== 1 ? "s" : ""}</strong> con <strong>{parsedBlocks.reduce((a, b) => a + b.topics.length, 0)} temas</strong> en total.</p>
              <div className="form-actions" style={{ marginTop: 12 }}>
                <Button type="button" disabled={!canImport} onClick={handleConfirm}>Añadir bloques al curso</Button>
                <Button type="button" className="secondary" onClick={resetState}>Limpiar</Button>
              </div>
            </div>
          )}
          {imported && <p className="save-feedback success" style={{ marginTop: 8 }}>Bloques añadidos correctamente.</p>}
        </div>
      )}
    </div>
  );
}
