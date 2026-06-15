import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import katex from "katex";
import { Pencil, Sigma } from "lucide-react";

function BlockMathView({ node, selected, editor }: NodeViewProps) {
  const latex = (node.attrs.latex as string) ?? "";

  let rendered = "";
  let hasError = false;
  try {
    rendered = katex.renderToString(latex, {
      throwOnError: true,
      output: "html",
      displayMode: true,
    });
  } catch {
    hasError = true;
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cb = (editor.storage as any)?.inlineMath?.openEditor as ((l: string, m: "inline" | "block") => void) | undefined;
    cb?.(latex, "block");
  }

  return (
    <NodeViewWrapper
      className={[
        "math-block-node",
        selected ? "math-node-selected" : "",
        hasError ? "math-node-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      contentEditable={false}
    >
      <div className="math-block-card">
        <div className="math-block-header">
          <span className="math-block-badge">
            <Sigma size={13} />
            Fórmula matemática
          </span>
          <button
            type="button"
            className="math-block-edit-btn"
            onClick={handleEdit}
            title="Editar fórmula"
          >
            <Pencil size={12} />
            Editar
          </button>
        </div>
        <div className="math-block-body">
          {hasError ? (
            <div className="math-error">
              <code>{latex || "(fórmula vacía)"}</code>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: rendered }} />
          )}
        </div>
        {latex && (
          <div className="math-block-footer">
            <code className="math-block-source">{latex}</code>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const BlockMath = Node.create({
  name: "blockMath",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      latex: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-math-block]",
        getAttrs: (el) => ({
          latex: (el as HTMLElement).getAttribute("data-math-block") ?? "",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const latex = (node.attrs.latex as string) ?? "";
    return [
      "div",
      { "data-math-block": latex, class: "math-block" },
      ["div", { class: "math-block-inner" }, latex],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockMathView);
  },
});
