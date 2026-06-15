import katex from "katex";

export function renderMathInContainer(container: HTMLElement | null) {
  if (!container) return;

  container.querySelectorAll<HTMLElement>("span[data-math-inline]").forEach((el) => {
    const latex = el.getAttribute("data-math-inline") ?? "";
    if (!latex) return;
    try {
      el.innerHTML = katex.renderToString(latex, { throwOnError: false, output: "html", displayMode: false });
      el.className = "math-inline";
    } catch {
      el.textContent = latex;
    }
  });

  container.querySelectorAll<HTMLElement>("div[data-math-block]").forEach((el) => {
    const latex = el.getAttribute("data-math-block") ?? "";
    if (!latex) return;
    try {
      const rendered = katex.renderToString(latex, { throwOnError: false, output: "html", displayMode: true });
      el.className = "math-block math-block-public";
      el.innerHTML = `
        <div class="math-block-header">
          <span class="math-block-badge">∑ Fórmula matemática</span>
        </div>
        <div class="math-block-body">${rendered}</div>
        <div class="math-block-footer"><code class="math-block-source">${latex.replace(/</g, "&lt;")}</code></div>
      `;
    } catch {
      const inner = el.querySelector(".math-block-inner");
      if (inner) el.innerHTML = inner.textContent ?? latex;
    }
  });
}
