import katex from "katex";
import { Sigma, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  initialLatex?: string;
  initialMode?: "inline" | "block";
  onConfirm: (latex: string, mode: "inline" | "block") => void;
  onCancel: () => void;
}

const TEMPLATES = [
  { label: "Fracción", latex: "\\frac{a}{b}" },
  { label: "Raíz cuadrada", latex: "\\sqrt{x}" },
  { label: "Sumatoria", latex: "\\sum_{i=1}^{n} x_i" },
  { label: "Integral", latex: "\\int_{a}^{b} f(x)\\,dx" },
  { label: "Media", latex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i" },
  { label: "Desv. estándar", latex: "\\sigma = \\sqrt{\\frac{\\sum(x-\\mu)^2}{N}}" },
  { label: "Pearson r", latex: "r = \\frac{\\sum(x-\\bar{x})(y-\\bar{y})}{\\sqrt{\\sum(x-\\bar{x})^2\\sum(y-\\bar{y})^2}}" },
  { label: "Chi-cuadrado", latex: "\\chi^2 = \\sum \\frac{(O-E)^2}{E}" },
  { label: "T de Student", latex: "t = \\frac{\\bar{x}-\\mu}{s/\\sqrt{n}}" },
  { label: "p-valor (normal)", latex: "z = \\frac{x - \\mu}{\\sigma}" },
  { label: "Regresión lineal", latex: "y = \\beta_0 + \\beta_1 x + \\varepsilon" },
  { label: "Potencia", latex: "x^{n}" },
  { label: "Subíndice", latex: "x_{n}" },
  { label: "Límite", latex: "\\lim_{x \\to \\infty} f(x)" },
  { label: "Producto", latex: "\\prod_{i=1}^{n} x_i" },
  { label: "Función normal", latex: "f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}" },
];

function renderPreview(latex: string, displayMode: boolean): { html: string; error: string } {
  if (!latex.trim()) return { html: "", error: "" };
  try {
    const html = katex.renderToString(latex, {
      throwOnError: true,
      output: "html",
      displayMode,
    });
    return { html, error: "" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { html: "", error: msg.replace(/^KaTeX parse error:\s*/i, "") };
  }
}

export function MathFormulaModal({ initialLatex = "", initialMode = "inline", onConfirm, onCancel }: Props) {
  const [latex, setLatex] = useState(initialLatex);
  const [mode, setMode] = useState<"inline" | "block">(initialMode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  const { html: previewHtml, error: previewError } = renderPreview(latex, mode === "block");

  function insertTemplate(tmplLatex: string) {
    setLatex(tmplLatex);
    textareaRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") onCancel();
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleConfirm();
  }

  function handleConfirm() {
    const trimmed = latex.trim();
    if (!trimmed) return;
    onConfirm(trimmed, mode);
  }

  return createPortal(
    <div className="desc-modal-overlay" onClick={onCancel} onKeyDown={handleKey} role="dialog" aria-modal="true">
      <div className="desc-modal math-modal" onClick={(e) => e.stopPropagation()}>
        <button className="desc-modal-close" onClick={onCancel} aria-label="Cerrar">
          <X size={18} />
        </button>

        <h3 className="math-modal-title">
          <Sigma size={20} />
          Insertar fórmula matemática
        </h3>

        {/* Mode toggle */}
        <div className="math-modal-mode">
          <button
            type="button"
            className={`math-mode-btn${mode === "inline" ? " active" : ""}`}
            onClick={() => setMode("inline")}
          >
            <Sigma size={14} />
            En línea
          </button>
          <button
            type="button"
            className={`math-mode-btn${mode === "block" ? " active" : ""}`}
            onClick={() => setMode("block")}
          >
            <Square size={14} />
            Bloque destacado
          </button>
        </div>

        {/* Templates */}
        <div className="math-modal-section">
          <span className="math-modal-label">Plantillas rápidas:</span>
          <div className="math-templates-grid">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                className="math-template-btn"
                onClick={() => insertTemplate(t.latex)}
                title={t.latex}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* LaTeX input */}
        <div className="math-modal-section">
          <span className="math-modal-label">LaTeX (también puedes pegar desde Word/MathType):</span>
          <textarea
            ref={textareaRef}
            className="math-latex-input"
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="Ejemplo: E = mc^2 o \frac{a}{b}"
            rows={3}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="math-modal-section">
          <span className="math-modal-label">Previsualización:</span>
          <div className={`math-preview${mode === "block" ? " math-preview-block" : ""}`}>
            {!latex.trim() && <span className="math-preview-empty">Escribe una fórmula para ver la previsualización</span>}
            {previewError && <span className="math-preview-error">⚠ {previewError}</span>}
            {!previewError && previewHtml && (
              <span dangerouslySetInnerHTML={{ __html: previewHtml }} />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="math-modal-actions">
          <button type="button" className="math-modal-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="math-modal-confirm"
            onClick={handleConfirm}
            disabled={!latex.trim() || !!previewError}
          >
            <Sigma size={15} />
            Insertar fórmula
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
