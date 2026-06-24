import { describe, expect, it } from "vitest";
import { mathmlElementToLatex, convertLatexDelimiters } from "../../utils/mathmlToLatex";

// ── Helpers ────────────────────────────────────────────────────────────────
function parseMath(mathml: string): Element {
  const doc = new DOMParser().parseFromString(mathml, "text/html");
  const el = doc.querySelector("math");
  if (!el) throw new Error("No <math> element found");
  return el;
}

function mathml(inner: string, display?: "block" | "inline") {
  const attr = display ? ` display="${display}"` : "";
  return `<math xmlns="http://www.w3.org/1998/Math/MathML"${attr}>${inner}</math>`;
}

// ── Annotation (LaTeX passthrough) ────────────────────────────────────────
describe("mathmlElementToLatex — annotation passthrough", () => {
  it("returns LaTeX from application/x-tex annotation", () => {
    const el = parseMath(mathml(`
      <semantics>
        <mrow><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></mrow>
        <annotation encoding="application/x-tex">E = mc^2</annotation>
      </semantics>
    `));
    expect(mathmlElementToLatex(el)).toBe("E = mc^2");
  });

  it("returns LaTeX from TeX annotation (alternate encoding name)", () => {
    const el = parseMath(mathml(`
      <semantics>
        <mrow><mi>x</mi></mrow>
        <annotation encoding="TeX">x</annotation>
      </semantics>
    `));
    expect(mathmlElementToLatex(el)).toBe("x");
  });

  it("trims whitespace from annotation", () => {
    const el = parseMath(mathml(`
      <semantics>
        <mrow><mi>a</mi></mrow>
        <annotation encoding="application/x-tex">   \\frac{a}{b}   </annotation>
      </semantics>
    `));
    expect(mathmlElementToLatex(el)).toBe("\\frac{a}{b}");
  });
});

// ── Greek letters ─────────────────────────────────────────────────────────
describe("mathmlElementToLatex — Greek letters", () => {
  const cases: [string, string, string][] = [
    ["α", "\\alpha", "alpha"],
    ["β", "\\beta", "beta"],
    ["γ", "\\gamma", "gamma"],
    ["δ", "\\delta", "delta"],
    ["ε", "\\epsilon", "epsilon"],
    ["ζ", "\\zeta", "zeta"],
    ["η", "\\eta", "eta"],
    ["θ", "\\theta", "theta"],
    ["λ", "\\lambda", "lambda"],
    ["μ", "\\mu", "mu"],
    ["ν", "\\nu", "nu"],
    ["ξ", "\\xi", "xi"],
    ["π", "\\pi", "pi"],
    ["ρ", "\\rho", "rho"],
    ["σ", "\\sigma", "sigma"],
    ["τ", "\\tau", "tau"],
    ["φ", "\\phi", "phi"],
    ["χ", "\\chi", "chi"],
    ["ψ", "\\psi", "psi"],
    ["ω", "\\omega", "omega"],
    ["Γ", "\\Gamma", "Gamma"],
    ["Δ", "\\Delta", "Delta"],
    ["Σ", "\\Sigma", "Sigma"],
    ["Ω", "\\Omega", "Omega"],
    ["ϕ", "\\varphi", "varphi"],
  ];

  for (const [char, latex, name] of cases) {
    it(`converts ${name} (${char}) → ${latex}`, () => {
      const el = parseMath(mathml(`<mi>${char}</mi>`));
      expect(mathmlElementToLatex(el)).toBe(latex);
    });
  }
});

// ── Operators ─────────────────────────────────────────────────────────────
describe("mathmlElementToLatex — operators", () => {
  const ops: [string, string][] = [
    ["≤", "\\leq"], ["≥", "\\geq"], ["≠", "\\neq"], ["≡", "\\equiv"],
    ["≈", "\\approx"], ["±", "\\pm"], ["×", "\\times"], ["÷", "\\div"],
    ["∑", "\\sum"], ["∏", "\\prod"], ["∫", "\\int"],
    ["∂", "\\partial"], ["∞", "\\infty"],
    ["∈", "\\in"], ["∉", "\\notin"], ["∩", "\\cap"], ["∪", "\\cup"],
    ["→", "\\to"], ["∀", "\\forall"], ["∃", "\\exists"],
    ["ℝ", "\\mathbb{R}"], ["ℕ", "\\mathbb{N}"],
  ];

  for (const [char, latex] of ops) {
    it(`operator ${char} → ${latex}`, () => {
      const el = parseMath(mathml(`<mo>${char}</mo>`));
      expect(mathmlElementToLatex(el).trim()).toBe(latex);
    });
  }
});

// ── Structural elements ───────────────────────────────────────────────────
describe("mathmlElementToLatex — structural conversions", () => {
  it("mfrac → \\frac{num}{den}", () => {
    const el = parseMath(mathml(`<mfrac><mi>a</mi><mi>b</mi></mfrac>`));
    expect(mathmlElementToLatex(el)).toBe("\\frac{a}{b}");
  });

  it("mfrac with complex numerator", () => {
    const el = parseMath(mathml(`<mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mn>2</mn></mfrac>`));
    expect(mathmlElementToLatex(el)).toContain("\\frac{");
    expect(mathmlElementToLatex(el)).toContain("2}");
  });

  it("msup → base^{exp}", () => {
    const el = parseMath(mathml(`<msup><mi>x</mi><mn>2</mn></msup>`));
    expect(mathmlElementToLatex(el)).toBe("x^{2}");
  });

  it("msub → base_{sub}", () => {
    const el = parseMath(mathml(`<msub><mi>H</mi><mn>0</mn></msub>`));
    expect(mathmlElementToLatex(el)).toBe("H_{0}");
  });

  it("msubsup → base_{sub}^{sup}", () => {
    const el = parseMath(mathml(`<msubsup><mo>∑</mo><mn>1</mn><mi>n</mi></msubsup>`));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("_{1}");
    expect(result).toContain("^{n}");
  });

  it("msqrt → \\sqrt{content}", () => {
    const el = parseMath(mathml(`<msqrt><mi>x</mi></msqrt>`));
    expect(mathmlElementToLatex(el)).toBe("\\sqrt{x}");
  });

  it("mroot → \\sqrt[n]{content}", () => {
    const el = parseMath(mathml(`<mroot><mi>x</mi><mn>3</mn></mroot>`));
    expect(mathmlElementToLatex(el)).toBe("\\sqrt[3]{x}");
  });

  it("mover with hat accent", () => {
    const el = parseMath(mathml(`<mover><mi>x</mi><mo>^</mo></mover>`));
    expect(mathmlElementToLatex(el)).toContain("hat");
  });

  it("mover with overline", () => {
    const el = parseMath(mathml(`<mover><mi>x</mi><mo>‾</mo></mover>`));
    expect(mathmlElementToLatex(el)).toContain("overline");
  });

  it("munder with lim", () => {
    const el = parseMath(mathml(`
      <munder>
        <mo>lim</mo>
        <mrow><mi>x</mi><mo>→</mo><mn>0</mn></mrow>
      </munder>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("lim");
  });

  it("munderover for sum with limits", () => {
    const el = parseMath(mathml(`
      <munderover>
        <mo>∑</mo>
        <mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow>
        <mi>n</mi>
      </munderover>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\sum");
    expect(result).toContain("_{");
    expect(result).toContain("^{n}");
  });

  it("mtext wraps content in \\text{}", () => {
    const el = parseMath(mathml(`<mtext>rechazar</mtext>`));
    expect(mathmlElementToLatex(el)).toBe("\\text{rechazar}");
  });

  it("mrow concatenates children", () => {
    const el = parseMath(mathml(`<mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow>`));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("a");
    expect(result).toContain("b");
  });
});

// ── Medical/statistical formulas (no LaTeX annotation) ───────────────────
describe("mathmlElementToLatex — medical statistics formulas without annotation", () => {
  it("chi-squared: χ²", () => {
    const el = parseMath(mathml(`
      <msup><mi>χ</mi><mn>2</mn></msup>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("chi");
    expect(result).toContain("^{2}");
  });

  it("H0 subscript", () => {
    const el = parseMath(mathml(`<msub><mi>H</mi><mn>0</mn></msub>`));
    expect(mathmlElementToLatex(el)).toBe("H_{0}");
  });

  it("H1 subscript", () => {
    const el = parseMath(mathml(`<msub><mi>H</mi><mn>1</mn></msub>`));
    expect(mathmlElementToLatex(el)).toBe("H_{1}");
  });

  it("alpha = 0.05 expression", () => {
    const el = parseMath(mathml(`
      <mrow><mi>α</mi><mo>=</mo><mn>0</mn><mo>.</mo><mn>05</mn></mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\alpha");
  });

  it("error type I: P(rechazar H0 | H0 verdadera)", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mi>α</mi><mo>=</mo>
        <mi>P</mi>
        <mfenced><mrow><mtext>rechazar</mtext><msub><mi>H</mi><mn>0</mn></msub><mo>∣</mo><msub><mi>H</mi><mn>0</mn></msub></mrow></mfenced>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\alpha");
    expect(result).toContain("P");
    expect(result).toContain("H");
  });

  it("power 1-β", () => {
    const el = parseMath(mathml(`
      <mrow><mn>1</mn><mo>-</mo><mi>β</mi></mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("1");
    expect(result).toContain("\\beta");
  });

  it("RR fraction formula", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mi>RR</mi><mo>=</mo>
        <mfrac>
          <mrow><mi>a</mi><mo>/</mo><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mrow>
          <mrow><mi>c</mi><mo>/</mo><mrow><mi>c</mi><mo>+</mo><mi>d</mi></mrow></mrow>
        </mfrac>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\frac");
  });

  it("t-test formula with square root", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mi>t</mi><mo>=</mo>
        <mfrac>
          <mrow><mover><mi>x</mi><mo>‾</mo></mover><mo>-</mo><mi>μ</mi></mrow>
          <mrow><mi>s</mi><mo>/</mo><msqrt><mi>n</mi></msqrt></mrow>
        </mfrac>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\frac");
    expect(result).toContain("\\sqrt");
    expect(result).toContain("\\mu");
  });

  it("standard deviation: sqrt of sum", () => {
    const el = parseMath(mathml(`
      <msqrt>
        <mfrac>
          <mrow>
            <munderover>
              <mo>∑</mo>
              <mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow>
              <mi>n</mi>
            </munderover>
            <msup><mrow><mi>x</mi><mo>-</mo><mover><mi>x</mi><mo>‾</mo></mover></mrow><mn>2</mn></msup>
          </mrow>
          <mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow>
        </mfrac>
      </msqrt>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\sqrt");
    expect(result).toContain("\\sum");
    expect(result).toContain("\\frac");
  });

  it("confidence interval 95% formula", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mover><mi>x</mi><mo>‾</mo></mover>
        <mo>±</mo>
        <mn>1.96</mn>
        <mo>·</mo>
        <mfrac><mi>σ</mi><msqrt><mi>n</mi></msqrt></mfrac>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\pm");
    expect(result).toContain("\\frac");
    expect(result).toContain("\\sqrt");
    expect(result).toContain("\\sigma");
  });

  it("p-value formula with integral", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mi>p</mi><mo>=</mo>
        <msubsup><mo>∫</mo><mi>t</mi><mo>∞</mo></msubsup>
        <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo>
        <mo>d</mo><mi>x</mi>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\int");
  });

  it("Pearson correlation coefficient", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mi>r</mi><mo>=</mo>
        <mfrac>
          <mrow><mo>∑</mo><mo>(</mo><mi>x</mi><mo>-</mo><mover><mi>x</mi><mo>‾</mo></mover><mo>)</mo><mo>(</mo><mi>y</mi><mo>-</mo><mover><mi>y</mi><mo>‾</mo></mover><mo>)</mo></mrow>
          <msqrt><mrow><mo>∑</mo><msup><mrow><mo>(</mo><mi>x</mi><mo>-</mo><mover><mi>x</mi><mo>‾</mo></mover><mo>)</mo></mrow><mn>2</mn></msup><mo>∑</mo><msup><mrow><mo>(</mo><mi>y</mi><mo>-</mo><mover><mi>y</mi><mo>‾</mo></mover><mo>)</mo></mrow><mn>2</mn></msup></mrow></msqrt>
        </mfrac>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\frac");
    expect(result).toContain("\\sqrt");
  });
});

// ── LaTeX delimiter detection ──────────────────────────────────────────────
describe("convertLatexDelimiters", () => {
  function applyDelimiters(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    convertLatexDelimiters(doc.body);
    return doc.body.innerHTML;
  }

  it("converts $$...$$ to data-math-block", () => {
    const result = applyDelimiters("<p>$$\\frac{a}{b}$$</p>");
    expect(result).toContain('data-math-block="\\frac{a}{b}"');
  });

  it("converts \\[...\\] to data-math-block", () => {
    const result = applyDelimiters("<p>\\[E = mc^2\\]</p>");
    expect(result).toContain("data-math-block");
    expect(result).toContain("E = mc^2");
  });

  it("converts \\(...\\) to data-math-inline", () => {
    const result = applyDelimiters("<p>valor \\(p < 0.05\\) significativo</p>");
    expect(result).toContain("data-math-inline");
    expect(result).toContain("p < 0.05");
  });

  it("handles multiple $$ blocks in same text", () => {
    const result = applyDelimiters("<p>$$\\alpha$$ y $$\\beta$$</p>");
    const count = (result.match(/data-math-block/g) ?? []).length;
    expect(count).toBe(2);
  });

  it("handles multiple \\(...\\) in one paragraph", () => {
    const result = applyDelimiters("<p>\\(\\alpha\\) y \\(\\beta\\)</p>");
    const count = (result.match(/data-math-inline/g) ?? []).length;
    expect(count).toBe(2);
  });

  it("does NOT convert single $price (false positive prevention)", () => {
    const result = applyDelimiters("<p>precio: $100 dólares</p>");
    expect(result).not.toContain("data-math");
  });

  it("does not modify <code> or <pre> blocks", () => {
    const result = applyDelimiters("<pre>$$code$$</pre>");
    expect(result).not.toContain("data-math-block");
    expect(result).toContain("$$code$$");
  });

  it("preserves surrounding text after conversion", () => {
    const result = applyDelimiters("<p>Antes $$x^2$$ Después</p>");
    expect(result).toContain("Antes");
    expect(result).toContain("Después");
    expect(result).toContain("data-math-block");
  });

  it("converts $$...$$ spanning multiple lines", () => {
    const result = applyDelimiters("<p>$$\\sum_{i=1}^{n}\nx_i$$</p>");
    expect(result).toContain("data-math-block");
  });

  it("handles \\[...\\] with complex LaTeX (medical formula)", () => {
    const result = applyDelimiters("<p>\\[\\alpha = P(\\text{rechazar} H_0 \\mid H_0)\\]</p>");
    expect(result).toContain("data-math-block");
    expect(result).toContain("alpha");
  });

  it("mixed $$ and \\( in same document", () => {
    const html = "<p>$$\\frac{a}{b}$$ y luego \\(p < 0.05\\)</p>";
    const result = applyDelimiters(html);
    expect(result).toContain("data-math-block");
    expect(result).toContain("data-math-inline");
  });
});

// ── Full Word paste simulation (no annotation) ────────────────────────────
describe("mathmlElementToLatex — complex Word pastes without annotation", () => {
  it("binomial coefficient (mfrac with linethickness=0 is not standard, test regular mfrac)", () => {
    const el = parseMath(mathml(`
      <mfrac>
        <mi>n</mi>
        <mi>k</mi>
      </mfrac>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\frac{n}{k}");
  });

  it("nested fractions", () => {
    const el = parseMath(mathml(`
      <mfrac>
        <mfrac><mn>1</mn><mn>2</mn></mfrac>
        <mfrac><mn>3</mn><mn>4</mn></mfrac>
      </mfrac>
    `));
    const result = mathmlElementToLatex(el);
    expect(result.match(/\\frac/g)?.length).toBe(3);
  });

  it("matrix 2×2", () => {
    const el = parseMath(mathml(`
      <mtable>
        <mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr>
        <mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr>
      </mtable>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("pmatrix");
    expect(result).toContain("a & b");
  });

  it("product with limits", () => {
    const el = parseMath(mathml(`
      <munderover>
        <mo>∏</mo>
        <mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow>
        <mi>n</mi>
      </munderover>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\prod");
    expect(result).toContain("_{");
    expect(result).toContain("^{n}");
  });

  it("integral with limits", () => {
    const el = parseMath(mathml(`
      <msubsup>
        <mo>∫</mo>
        <mn>0</mn>
        <mn>1</mn>
      </msubsup>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\int");
    expect(result).toContain("_{0}");
    expect(result).toContain("^{1}");
  });

  it("mfenced with parentheses", () => {
    const el = parseMath(mathml(`
      <mfenced open="(" close=")">
        <mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow>
      </mfenced>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\left(");
    expect(result).toContain("\\right)");
  });

  it("mfenced with square brackets", () => {
    const el = parseMath(mathml(`
      <mfenced open="[" close="]">
        <mn>0</mn><mn>1</mn>
      </mfenced>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\left[");
    expect(result).toContain("\\right]");
  });

  it("semantics element wrapping", () => {
    const el = parseMath(mathml(`
      <semantics>
        <mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow>
        <annotation-xml encoding="MathML-Content">
          <apply><plus/><ci>x</ci><ci>y</ci></apply>
        </annotation-xml>
      </semantics>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("x");
    expect(result).toContain("y");
    // annotation-xml should NOT appear
    expect(result).not.toContain("apply");
    expect(result).not.toContain("plus");
  });

  it("multi-character mi identifier", () => {
    const el = parseMath(mathml(`<mi>sin</mi>`));
    expect(mathmlElementToLatex(el)).toBe("\\sin");
  });

  it("named function Pr (probability)", () => {
    const el = parseMath(mathml(`<mi>Pr</mi>`));
    expect(mathmlElementToLatex(el)).toBe("\\Pr");
  });

  it("empty math element returns empty string", () => {
    const el = parseMath(mathml(`<mrow></mrow>`));
    expect(mathmlElementToLatex(el)).toBe("");
  });

  it("mixed text and math in mrow", () => {
    const el = parseMath(mathml(`
      <mrow>
        <mi>p</mi><mo>=</mo><mn>0</mn><mo>,</mo><mn>05</mn>
      </mrow>
    `));
    const result = mathmlElementToLatex(el);
    expect(result).toContain("p");
    expect(result).toContain("0");
    expect(result).toContain("05");
  });
});
