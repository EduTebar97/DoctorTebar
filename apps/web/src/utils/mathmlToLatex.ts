// MathML → LaTeX converter — fallback for Word equations without LaTeX annotation.
// Handles the common subset used in medical/statistical documents.

const GREEK: Record<string, string> = {
  α: "\\alpha", β: "\\beta", γ: "\\gamma", δ: "\\delta",
  ε: "\\epsilon", ζ: "\\zeta", η: "\\eta", θ: "\\theta",
  ι: "\\iota", κ: "\\kappa", λ: "\\lambda", μ: "\\mu",
  ν: "\\nu", ξ: "\\xi", π: "\\pi", ρ: "\\rho",
  σ: "\\sigma", τ: "\\tau", υ: "\\upsilon", φ: "\\phi",
  χ: "\\chi", ψ: "\\psi", ω: "\\omega",
  Γ: "\\Gamma", Δ: "\\Delta", Θ: "\\Theta", Λ: "\\Lambda",
  Ξ: "\\Xi", Π: "\\Pi", Σ: "\\Sigma", Υ: "\\Upsilon",
  Φ: "\\Phi", Ψ: "\\Psi", Ω: "\\Omega",
  ϕ: "\\varphi", ϑ: "\\vartheta", ϵ: "\\varepsilon",
  ϱ: "\\varrho", ϖ: "\\varpi",
};

const OPS: Record<string, string> = {
  "≤": "\\leq", "≥": "\\geq", "≠": "\\neq", "≡": "\\equiv",
  "≈": "\\approx", "∼": "\\sim", "∝": "\\propto",
  "±": "\\pm", "∓": "\\mp", "×": "\\times", "÷": "\\div", "·": "\\cdot",
  "∑": "\\sum", "∏": "\\prod", "∫": "\\int", "∬": "\\iint", "∭": "\\iiint",
  "∂": "\\partial", "∇": "\\nabla", "∞": "\\infty",
  "∈": "\\in", "∉": "\\notin", "⊂": "\\subset", "⊃": "\\supset",
  "⊆": "\\subseteq", "⊇": "\\supseteq",
  "∩": "\\cap", "∪": "\\cup", "∅": "\\emptyset",
  "→": "\\to", "←": "\\leftarrow", "↔": "\\leftrightarrow",
  "⟹": "\\Rightarrow", "⟺": "\\Leftrightarrow",
  "⇒": "\\Rightarrow", "⇔": "\\Leftrightarrow", "⇐": "\\Leftarrow",
  "∀": "\\forall", "∃": "\\exists", "¬": "\\neg",
  "∣": "\\mid", "∥": "\\parallel", "⊥": "\\perp",
  "⌈": "\\lceil", "⌉": "\\rceil", "⌊": "\\lfloor", "⌋": "\\rfloor",
  "√": "\\sqrt", "…": "\\ldots", "⋯": "\\cdots", "⋮": "\\vdots",
  "′": "'", "″": "''", "°": "^\\circ",
  "ℝ": "\\mathbb{R}", "ℕ": "\\mathbb{N}", "ℤ": "\\mathbb{Z}",
  "ℚ": "\\mathbb{Q}", "ℂ": "\\mathbb{C}",
};

// Named functions that should appear in \operatorname{} or as-is
const NAMED_FUNCS = new Set([
  "sin", "cos", "tan", "cot", "sec", "csc",
  "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh",
  "log", "ln", "exp", "lim", "sup", "inf",
  "max", "min", "det", "tr", "rank", "dim",
  "Pr", "E", "Var", "Cov", "SD", "SE", "OR", "RR", "HR",
]);

// Limit-style operators whose subscripts go below
const LIMIT_OPS = new Set(["\\sum", "\\prod", "\\int", "\\iint", "\\iiint", "\\lim", "\\max", "\\min", "\\inf", "\\sup"]);

function charToLatex(ch: string): string {
  return GREEK[ch] ?? OPS[ch] ?? ch;
}

function textToLatex(text: string): string {
  return [...text].map(charToLatex).join("");
}

function childLatex(el: Element, index: number): string {
  const child = Array.from(el.children)[index];
  return child ? nodeToLatex(child) : "";
}

function allChildLatex(el: Element): string {
  return Array.from(el.children).map(nodeToLatex).join("");
}

function nodeToLatex(el: Element): string {
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case "math": {
      const sem = el.querySelector("semantics");
      if (sem) return nodeToLatex(sem);
      return allChildLatex(el);
    }

    case "semantics": {
      const presentational = Array.from(el.children).find(
        (c) => c.tagName.toLowerCase() !== "annotation" && c.tagName.toLowerCase() !== "annotation-xml"
      );
      return presentational ? nodeToLatex(presentational) : "";
    }

    case "mrow":
    case "mstyle":
    case "mpadded":
    case "mphantom":
    case "merror":
      return allChildLatex(el);

    case "mfrac": {
      const moverlimits = el.getAttribute("linethickness") === "0";
      const num = childLatex(el, 0);
      const den = childLatex(el, 1);
      if (moverlimits) return `\\binom{${num}}{${den}}`;
      return `\\frac{${num}}{${den}}`;
    }

    case "msqrt":
      return `\\sqrt{${allChildLatex(el)}}`;

    case "mroot":
      return `\\sqrt[${childLatex(el, 1)}]{${childLatex(el, 0)}}`;

    case "msup": {
      const base = childLatex(el, 0);
      const exp = childLatex(el, 1);
      return `${base}^{${exp}}`;
    }

    case "msub": {
      const base = childLatex(el, 0);
      const sub = childLatex(el, 1);
      return `${base}_{${sub}}`;
    }

    case "msubsup": {
      const base = childLatex(el, 0);
      const sub = childLatex(el, 1);
      const sup = childLatex(el, 2);
      return `${base}_{${sub}}^{${sup}}`;
    }

    case "munder": {
      const base = childLatex(el, 0);
      const under = childLatex(el, 1);
      if (LIMIT_OPS.has(base.trim())) return `${base.trim()}_{${under}}`;
      return `\\underset{${under}}{${base}}`;
    }

    case "mover": {
      const base = childLatex(el, 0);
      const over = childLatex(el, 1).trim();
      if (over === "→" || over === "\\to") return `\\vec{${base}}`;
      if (over === "^" || over === "∧" || over === "̂") return `\\hat{${base}}`;
      if (over === "‾" || over === "-" || over === "‒") return `\\overline{${base}}`;
      if (over === "~" || over === "˜") return `\\tilde{${base}}`;
      if (over === "·" || over === "∙") return `\\dot{${base}}`;
      if (over === "¨") return `\\ddot{${base}}`;
      return `\\overset{${over}}{${base}}`;
    }

    case "munderover": {
      const base = childLatex(el, 0);
      const under = childLatex(el, 1);
      const over = childLatex(el, 2);
      const b = base.trim();
      if (LIMIT_OPS.has(b)) return `${b}_{${under}}^{${over}}`;
      return `\\underset{${under}}{\\overset{${over}}{${base}}}`;
    }

    case "mtable": {
      const rows = Array.from(el.querySelectorAll("mtr")).map((row) =>
        Array.from(row.querySelectorAll("mtd"))
          .map((cell) => allChildLatex(cell))
          .join(" & ")
      );
      const env = el.getAttribute("columnlines") ? "array" : "pmatrix";
      return `\\begin{${env}}${rows.join(" \\\\ ")}\\end{${env}}`;
    }

    case "mtr":
    case "mtd":
      return allChildLatex(el);

    case "mfenced": {
      const open = el.getAttribute("open") ?? "(";
      const close = el.getAttribute("close") ?? ")";
      const sep = el.getAttribute("separators") ?? ",";
      const content = Array.from(el.children).map(nodeToLatex).join(`${sep} `);
      const openLatex = open === "{" ? "\\{" : open;
      const closeLatex = close === "}" ? "\\}" : close;
      return `\\left${openLatex}${content}\\right${closeLatex}`;
    }

    case "mi": {
      const text = el.textContent?.trim() ?? "";
      if (!text) return "";
      if (text.length === 1) return charToLatex(text);
      if (NAMED_FUNCS.has(text)) return `\\${text}`;
      const allMapped = [...text].every((c) => GREEK[c]);
      if (allMapped) return [...text].map((c) => GREEK[c] ?? c).join(" ");
      return `\\mathrm{${text}}`;
    }

    case "mn":
      return el.textContent?.trim() ?? "";

    case "mo": {
      const text = el.textContent?.trim() ?? "";
      if (!text) return "";
      if (text === "(" || text === ")") return text;
      if (text === "[" || text === "]") return text;
      if (text === "{") return "\\{";
      if (text === "}") return "\\}";
      if (text === "|") return "|";
      if (text === "||") return "\\|";
      // Multi-char operators
      if (text.length > 1) return " " + textToLatex(text) + " ";
      return " " + charToLatex(text) + " ";
    }

    case "mtext": {
      const text = el.textContent?.trim() ?? "";
      if (!text) return "";
      if (text === " " || text === " ") return "\\ ";
      return `\\text{${text}}`;
    }

    case "ms":
      return `"${el.textContent?.trim() ?? ""}"`;

    case "mspace":
      return "\\ ";

    case "mmultiscripts": {
      // Simplified: just treat as the base element
      return childLatex(el, 0);
    }

    case "annotation":
    case "annotation-xml":
      return "";

    default:
      return el.textContent?.trim() ?? "";
  }
}

/** Convert a `<math>` DOM element to a LaTeX string.
 *  Tries the LaTeX annotation first; falls back to structural conversion. */
export function mathmlElementToLatex(mathEl: Element): string {
  const annotation =
    mathEl.querySelector('annotation[encoding="application/x-tex"]') ??
    mathEl.querySelector('annotation[encoding="TeX"]');
  const annotationLatex = annotation?.textContent?.trim();
  if (annotationLatex) return annotationLatex;

  const result = nodeToLatex(mathEl).replace(/\s{2,}/g, " ").trim();
  return result;
}

/** Detect and convert `$$...$$`, `\[...\]` (block) and `\(...\)` (inline) delimiters
 *  in text nodes of the given DOM document body. Mutates the document in-place. */
export function convertLatexDelimiters(body: HTMLElement): void {
  const BLOCK_RE = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
  const INLINE_RE = /\\\((.+?)\\\)/g;

  function processText(node: Text) {
    const text = node.textContent ?? "";
    if (!text.includes("$$") && !text.includes("\\[") && !text.includes("\\(")) return;

    const matches: Array<{ start: number; end: number; latex: string; block: boolean }> = [];
    let m: RegExpExecArray | null;

    BLOCK_RE.lastIndex = 0;
    while ((m = BLOCK_RE.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, latex: (m[1] ?? m[2]).trim(), block: true });
    }

    INLINE_RE.lastIndex = 0;
    while ((m = INLINE_RE.exec(text)) !== null) {
      const inBlock = matches.some((bm) => m!.index >= bm.start && m!.index + m![0].length <= bm.end);
      if (!inBlock) {
        matches.push({ start: m.index, end: m.index + m[0].length, latex: m[1].trim(), block: false });
      }
    }

    if (!matches.length) return;
    matches.sort((a, b) => a.start - b.start);

    const ownerDoc = node.ownerDocument;
    const fragment = ownerDoc.createDocumentFragment();
    let cursor = 0;

    for (const match of matches) {
      if (match.start > cursor) {
        fragment.appendChild(ownerDoc.createTextNode(text.slice(cursor, match.start)));
      }
      const el = ownerDoc.createElement(match.block ? "div" : "span");
      el.setAttribute(match.block ? "data-math-block" : "data-math-inline", match.latex);
      el.textContent = match.latex;
      fragment.appendChild(el);
      cursor = match.end;
    }
    if (cursor < text.length) {
      fragment.appendChild(ownerDoc.createTextNode(text.slice(cursor)));
    }

    node.parentNode?.replaceChild(fragment, node);
  }

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processText(node as Text);
    } else {
      const tag = (node as Element).tagName?.toLowerCase();
      if (["script", "style", "code", "pre"].includes(tag)) return;
      // Snapshot childNodes first since processText may mutate the tree
      Array.from(node.childNodes).forEach(walk);
    }
  }

  walk(body);
}
