import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, FileText, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { adminCreate } from "../../services/contentService";
import { parseFormationMarkdown, validateFormationImport } from "../../utils/formation-parser";
import type { ParsedFormation } from "../../utils/formation-parser";

type Step = "upload" | "preview" | "done";

export function AdminTrainingImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedFormation | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  const importMutation = useMutation({
    mutationFn: () => {
      if (!parsed) throw new Error("No hay datos para importar");
      return adminCreate("training", {
        title: parsed.metadata.title,
        description: parsed.metadata.description,
        status: parsed.metadata.status,
        featured: parsed.metadata.featured,
        order: parsed.metadata.order,
        coverImageUrl: parsed.metadata.coverImageUrl,
        blocks: parsed.blocks
      });
    },
    onSuccess: () => {
      setStep("done");
      setTimeout(() => navigate("/admin/training"), 2000);
    },
    onError: (error: any) => {
      setImportError(
        error?.response?.data?.message ?? error?.message ?? "Error desconocido al importar"
      );
    }
  });

  function processFile(file: File) {
    if (!file.name.endsWith(".md")) {
      setValidationErrors(["Error: el archivo debe tener extensión .md"]);
      setParsed(null);
      setStep("preview");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseFormationMarkdown(text);
      const errors = validateFormationImport(result);
      setParsed(result);
      setValidationErrors(errors);
      setImportError(null);
      setStep("preview");
    };
    reader.readAsText(file, "utf-8");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleReset() {
    setParsed(null);
    setValidationErrors([]);
    setImportError(null);
    setFileName("");
    setStep("upload");
  }

  const totalTopics = parsed?.blocks.reduce((acc, b) => acc + b.topics.length, 0) ?? 0;
  const canImport = validationErrors.length === 0 && parsed !== null && parsed.blocks.length > 0;

  // ── Paso 3: Hecho ──────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="import-page">
        <div className="import-success-state">
          <CheckCircle size={40} color="#86efac" />
          <h2>Formación importada correctamente</h2>
          <p>Redirigiendo al listado de formaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="import-page">
      <div className="admin-heading">
        <h1>Importar formación desde documento</h1>
        <Link className="btn secondary" to="/admin/training">← Formaciones</Link>
      </div>

      {/* ── Paso 1: Upload ─────────────────────────────────────────────────── */}
      <div
        className={`import-dropzone${dragOver ? " dragover" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <FileText size={36} strokeWidth={1.5} />
        {fileName
          ? <><p className="import-dropzone-name">{fileName}</p><p className="field-note">Haz clic para cambiar el archivo</p></>
          : <><p>Selecciona o arrastra un archivo <strong>.md</strong></p><p className="field-note">El archivo debe seguir el formato de importación de formaciones</p></>
        }
        <label className="upload-inline" style={{ pointerEvents: "none" }}>
          <Upload size={14} style={{ marginRight: 6 }} />
          <span>Seleccionar archivo .md</span>
        </label>
      </div>

      <p className="field-note" style={{ textAlign: "center" }}>
        ¿No tienes el formato? Consulta la{" "}
        <a
          href="/prompt-documentacion-automatica.md"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--brand)" }}
        >
          guía de formato
        </a>.
      </p>

      {/* ── Paso 2: Preview y errores ──────────────────────────────────────── */}
      {step === "preview" && (
        <div className="import-preview">

          {/* Errores de validación */}
          {validationErrors.length > 0 && (
            <div className="import-error-box">
              <div className="import-error-header">
                <AlertCircle size={16} />
                <strong>
                  {validationErrors.length === 1
                    ? "Se ha encontrado 1 error en el documento"
                    : `Se han encontrado ${validationErrors.length} errores en el documento`}
                </strong>
              </div>
              <ul className="import-error-list">
                {validationErrors.map((err, i) => (
                  <li key={i} className="import-error-item">{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview de la formación */}
          {parsed && parsed.blocks.length > 0 && (
            <>
              <div className="import-summary-box">
                <div className="import-summary-meta">
                  <h2 className="import-formation-title">{parsed.metadata.title || "(Sin título)"}</h2>
                  {parsed.metadata.description && (
                    <p className="import-formation-desc">{parsed.metadata.description}</p>
                  )}
                </div>
                <div className="import-summary-stats">
                  <div className="import-stat">
                    <span className="import-stat-value">{parsed.blocks.length}</span>
                    <span className="import-stat-label">bloques</span>
                  </div>
                  <div className="import-stat">
                    <span className="import-stat-value">{totalTopics}</span>
                    <span className="import-stat-label">temas</span>
                  </div>
                  <div className="import-stat">
                    <span className="import-stat-value">{parsed.metadata.status}</span>
                    <span className="import-stat-label">estado</span>
                  </div>
                </div>
              </div>

              <div className="import-blocks-list">
                {parsed.blocks.map((block, bi) => (
                  <div key={bi} className="import-block-card">
                    <div className="import-block-header">
                      <span className="import-block-num">Bloque {bi + 1}</span>
                      <strong>{block.title}</strong>
                      <span className="import-topic-count">{block.topics.length} tema{block.topics.length !== 1 ? "s" : ""}</span>
                    </div>
                    {block.description && (
                      <p className="import-block-desc">{block.description}</p>
                    )}
                    <ul className="import-topic-list">
                      {block.topics.map((topic, ti) => (
                        <li key={ti} className="import-topic-item">
                          <span className="import-topic-num">{ti + 1}</span>
                          <span className="import-topic-title">{topic.title}</span>
                          {topic.description && (
                            <span className="import-topic-desc"> — {topic.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Error de importación (API) */}
          {importError && (
            <div className="save-feedback error">
              <strong>Error al importar:</strong> {importError}
            </div>
          )}

          {/* Acciones */}
          <div className="form-actions">
            <Button
              type="button"
              disabled={!canImport || importMutation.isPending}
              onClick={() => importMutation.mutate()}
            >
              {importMutation.isPending ? "Importando..." : "Importar formación"}
            </Button>
            <Button type="button" className="secondary" onClick={handleReset}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
