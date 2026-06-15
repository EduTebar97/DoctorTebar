import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import katex from "katex";

function InlineMathView({ node, selected, editor }: NodeViewProps) {
  const latex = (node.attrs.latex as string) ?? "";

  let rendered = "";
  let hasError = false;
  try {
    rendered = katex.renderToString(latex, {
      throwOnError: true,
      output: "html",
      displayMode: false,
    });
  } catch {
    hasError = true;
  }

  function handleClick() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cb = (editor.storage as any)?.inlineMath?.openEditor as ((l: string, m: "inline" | "block") => void) | undefined;
    cb?.(latex, "inline");
  }

  return (
    <NodeViewWrapper
      as="span"
      className={[
        "math-inline-node",
        selected ? "math-node-selected" : "",
        hasError ? "math-node-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      title="Haz clic para editar la fórmula"
    >
      {hasError ? (
        <span className="math-error" title={latex}>
          ⚠ fórmula inválida
        </span>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      )}
    </NodeViewWrapper>
  );
}

export const InlineMath = Node.create({
  name: "inlineMath",
  group: "inline",
  inline: true,
  atom: true,

  addStorage() {
    return {
      openEditor: null as ((latex: string, mode: "inline" | "block") => void) | null,
    };
  },

  addAttributes() {
    return {
      latex: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-math-inline]",
        getAttrs: (el) => ({
          latex: (el as HTMLElement).getAttribute("data-math-inline") ?? "",
        }),
      },
    ];
  },

  renderHTML({ node }) {
    const latex = (node.attrs.latex as string) ?? "";
    return ["span", { "data-math-inline": latex, class: "math-inline" }, latex];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineMathView);
  },
});
