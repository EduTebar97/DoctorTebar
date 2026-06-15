import { describe, expect, it } from "vitest";
import { renderMathInContainer } from "../../utils/renderMath";

function makeContainer(html: string): HTMLDivElement {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
}

describe("renderMathInContainer", () => {
  it("does nothing when container is null", () => {
    expect(() => renderMathInContainer(null)).not.toThrow();
  });

  it("renders an inline math formula from data-math-inline attribute", () => {
    const container = makeContainer('<span data-math-inline="E = mc^2"></span>');
    renderMathInContainer(container);
    const span = container.querySelector("span");
    expect(span?.className).toBe("math-inline");
    expect(span?.innerHTML).not.toBe("");
    expect(span?.innerHTML).toContain("katex");
  });

  it("renders a block math formula from data-math-block attribute", () => {
    const container = makeContainer('<div data-math-block="\\sum_{i=1}^{n} x_i"></div>');
    renderMathInContainer(container);
    const div = container.querySelector("div");
    expect(div?.className).toContain("math-block");
    expect(div?.innerHTML).toContain("math-block-body");
    expect(div?.innerHTML).toContain("math-block-footer");
  });

  it("adds math-block-badge with sigma symbol in block output", () => {
    const container = makeContainer('<div data-math-block="x^2"></div>');
    renderMathInContainer(container);
    expect(container.innerHTML).toContain("Fórmula matemática");
  });

  it("handles empty data-math-inline attribute gracefully", () => {
    const container = makeContainer('<span data-math-inline=""></span>');
    expect(() => renderMathInContainer(container)).not.toThrow();
    // Empty latex is skipped — innerHTML should remain empty
    const span = container.querySelector("span");
    expect(span?.innerHTML).toBe("");
  });

  it("handles empty data-math-block attribute gracefully", () => {
    const container = makeContainer('<div data-math-block=""></div>');
    expect(() => renderMathInContainer(container)).not.toThrow();
  });

  it("processes multiple inline formulas in one container", () => {
    const container = makeContainer(`
      <span data-math-inline="x^2"></span>
      <span data-math-inline="y^2"></span>
    `);
    renderMathInContainer(container);
    const spans = container.querySelectorAll("span.math-inline");
    expect(spans.length).toBe(2);
  });

  it("does not modify elements without math data attributes", () => {
    const container = makeContainer('<p>Plain text paragraph</p>');
    renderMathInContainer(container);
    expect(container.querySelector("p")?.textContent).toBe("Plain text paragraph");
  });

  it("escapes html in the block footer source display", () => {
    const latex = "x < y";
    const container = makeContainer(`<div data-math-block="${latex}"></div>`);
    renderMathInContainer(container);
    const footer = container.querySelector(".math-block-footer");
    expect(footer?.innerHTML).toContain("&lt;");
  });
});
