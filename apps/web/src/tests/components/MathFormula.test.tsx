import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { mathmlElementToLatex, convertLatexDelimiters } from "../../utils/mathmlToLatex";

function pasteHtml(element: HTMLElement, html: string) {
  fireEvent.paste(element, {
    clipboardData: { getData: (type: string) => (type === "text/html" ? html : "") }
  });
}

describe("Math formula support", () => {
  it("renders toolbar with inline and block math buttons", () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    expect(screen.getByTitle("Fórmula en línea (∑)")).toBeInTheDocument();
    expect(screen.getByTitle("Fórmula en bloque destacado")).toBeInTheDocument();
  });

  it("opens math modal when inline math button is clicked", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    const btn = screen.getByTitle("Fórmula en línea (∑)");
    await userEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByText("Insertar fórmula matemática")).toBeInTheDocument();
    });
  });

  it("opens math modal when block math button is clicked", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    const btn = screen.getByTitle("Fórmula en bloque destacado");
    await userEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByText("Insertar fórmula matemática")).toBeInTheDocument();
    });
  });

  it("math modal shows inline mode by default when clicking inline button", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByTitle("Fórmula en línea (∑)"));
    await waitFor(() => screen.getByText("Insertar fórmula matemática"));
    // Query the active mode button within the modal (uses CSS class, not accessible name)
    const activeBtn = document.querySelector(".math-mode-btn.active");
    expect(activeBtn?.textContent).toMatch(/En línea/i);
  });

  it("math modal shows block mode when clicking block button", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByTitle("Fórmula en bloque destacado"));
    await waitFor(() => screen.getByText("Insertar fórmula matemática"));
    const activeBtn = document.querySelector(".math-mode-btn.active");
    expect(activeBtn?.textContent).toMatch(/Bloque/i);
  });

  it("math modal closes on cancel button click", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByTitle("Fórmula en línea (∑)"));
    await waitFor(() => screen.getByText("Insertar fórmula matemática"));
    await userEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    await waitFor(() => {
      expect(screen.queryByText("Insertar fórmula matemática")).not.toBeInTheDocument();
    });
  });

  it("template buttons populate the LaTeX input", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByTitle("Fórmula en línea (∑)"));
    await waitFor(() => screen.getByText("Fracción"));
    await userEvent.click(screen.getByText("Fracción"));
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Ejemplo: E = mc\^2/i) as HTMLTextAreaElement;
      expect(input.value).toBe("\\frac{a}{b}");
    });
  });

  it("confirm button is disabled when LaTeX input is empty", async () => {
    render(<RichTextEditor value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByTitle("Fórmula en línea (∑)"));
    await waitFor(() => screen.getByText("Insertar fórmula matemática"));
    const confirmBtn = screen.getByRole("button", { name: /Insertar fórmula/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("inserting a formula calls onChange with the serialized math node", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    await userEvent.click(screen.getByTitle("Fórmula en línea (∑)"));
    await waitFor(() => screen.getByPlaceholderText(/Ejemplo: E = mc\^2/i));
    const input = screen.getByPlaceholderText(/Ejemplo: E = mc\^2/i);
    await userEvent.clear(input);
    await userEvent.type(input, "E = mc^2");
    await userEvent.click(screen.getByRole("button", { name: /Insertar fórmula/i }));
    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-inline");
      expect(lastCall).toContain("E = mc^2");
    });
  });

  it("detects and converts MathML math elements from Word paste", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const wordMathHtml = `
      <p>Aquí hay una fórmula:</p>
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <semantics>
          <mrow><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></mrow>
          <annotation encoding="application/x-tex">E = mc^2</annotation>
        </semantics>
      </math>
    `;

    pasteHtml(editor, wordMathHtml);

    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-inline");
      expect(lastCall).toContain("E = mc^2");
    });
  });

  it("handles Word paste with block display MathML", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const wordBlockMathHtml = `
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
        <semantics>
          <mrow><msubsup><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></msubsup><msub><mi>x</mi><mi>i</mi></msub></mrow>
          <annotation encoding="application/x-tex">\\sum_{i=1}^{n} x_i</annotation>
        </semantics>
      </math>
    `;

    pasteHtml(editor, wordBlockMathHtml);

    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-block");
    });
  });

  it("loads existing inline math content from saved HTML", async () => {
    const savedHtml = '<p>Fórmula: <span data-math-inline="E = mc^2" class="math-inline">E = mc^2</span></p>';
    render(<RichTextEditor value={savedHtml} onChange={vi.fn()} />);
    await waitFor(() => {
      const editor = screen.getByRole("textbox");
      expect(editor).toBeInTheDocument();
    });
  });

  it("loads existing block math content from saved HTML", async () => {
    const savedHtml = '<div data-math-block="\\frac{a}{b}" class="math-block"><div class="math-block-inner">\\frac{a}{b}</div></div>';
    render(<RichTextEditor value={savedHtml} onChange={vi.fn()} />);
    await waitFor(() => {
      const editor = screen.getByTestId("rich-editor");
      expect(editor).toBeInTheDocument();
    });
  });

  it("converts MathML without LaTeX annotation using structural fallback", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    // Word equation without TeX annotation — pure MathML
    const wordMathNoAnnotation = `
      <p>Fracción:</p>
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mfrac><mi>a</mi><mi>b</mi></mfrac>
      </math>
    `;

    pasteHtml(editor, wordMathNoAnnotation);

    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      // Should produce a math node (not silently drop it)
      expect(lastCall).toContain("data-math-inline");
      expect(lastCall).toContain("frac");
    });
  });

  it("converts MathML subscripts and superscripts without annotation", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const wordMathSubSup = `
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <msub><mi>H</mi><mn>0</mn></msub>
      </math>
    `;
    pasteHtml(editor, wordMathSubSup);
    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-inline");
      expect(lastCall).toContain("H");
      expect(lastCall).toContain("0");
    });
  });

  it("converts Greek letters in MathML without annotation", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const wordGreekMath = `
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mrow><mi>α</mi><mo>=</mo><mn>0</mn><mo>,</mo><mn>05</mn></mrow>
      </math>
    `;
    pasteHtml(editor, wordGreekMath);
    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-inline");
      expect(lastCall).toContain("alpha");
    });
  });

  it("detects $$...$$ block math delimiters in pasted HTML", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const latexBlockHtml = `<p>La fórmula es: $$\\frac{a}{b}$$ como se muestra.</p>`;
    pasteHtml(editor, latexBlockHtml);
    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-block");
      expect(lastCall).toContain("frac");
    });
  });

  it("detects \\(...\\) inline math delimiters in pasted HTML", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const latexInlineHtml = `<p>El valor \\(p < 0.05\\) es significativo.</p>`;
    pasteHtml(editor, latexInlineHtml);
    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      expect(lastCall).toContain("data-math-inline");
    });
  });

  it("handles mixed Word paste: text paragraphs + multiple MathML formulas", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);
    const editor = screen.getByRole("textbox");

    const mixedWordHtml = `
      <p class="MsoNormal">Prueba estadística:</p>
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <semantics>
          <mrow><mi>χ</mi><msup><mi></mi><mn>2</mn></msup></mrow>
          <annotation encoding="application/x-tex">\\chi^2</annotation>
        </semantics>
      </math>
      <p class="MsoNormal">Con nivel:</p>
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mrow><mi>α</mi><mo>=</mo><mn>0</mn><mo>.</mo><mn>05</mn></mrow>
      </math>
    `;
    pasteHtml(editor, mixedWordHtml);
    await waitFor(() => {
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]?.[0] ?? "";
      // Both formulas must be present
      const mathCount = (lastCall.match(/data-math/g) ?? []).length;
      expect(mathCount).toBeGreaterThanOrEqual(2);
      expect(lastCall).toContain("chi");
    });
  });
});

// ── Unit tests for mathmlToLatex utilities ─────────────────────────────────
describe("mathmlToLatex utilities", () => {
  function parseMath(mathml: string): Element {
    const doc = new DOMParser().parseFromString(mathml, "text/html");
    return doc.querySelector("math")!;
  }

  it("prefers LaTeX annotation when present", () => {
    const el = parseMath(`
      <math><semantics><mrow><mi>x</mi></mrow>
        <annotation encoding="application/x-tex">x</annotation>
      </semantics></math>
    `);
    expect(mathmlElementToLatex(el)).toBe("x");
  });

  it("converts mfrac to \\frac{}{}", () => {
    const el = parseMath(`<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>`);
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\frac{a}{b}");
  });

  it("converts msub to base_{sub}", () => {
    const el = parseMath(`<math><msub><mi>H</mi><mn>0</mn></msub></math>`);
    const result = mathmlElementToLatex(el);
    expect(result).toBe("H_{0}");
  });

  it("converts msup to base^{exp}", () => {
    const el = parseMath(`<math><msup><mi>x</mi><mn>2</mn></msup></math>`);
    const result = mathmlElementToLatex(el);
    expect(result).toBe("x^{2}");
  });

  it("converts msubsup to base_{sub}^{sup}", () => {
    const el = parseMath(`<math><msubsup><mi>σ</mi><mn>1</mn><mn>2</mn></msubsup></math>`);
    const result = mathmlElementToLatex(el);
    expect(result).toContain("_{1}");
    expect(result).toContain("^{2}");
  });

  it("converts Greek letter mi to LaTeX command", () => {
    const el = parseMath(`<math><mi>α</mi></math>`);
    expect(mathmlElementToLatex(el)).toBe("\\alpha");
  });

  it("converts msqrt to \\sqrt{}", () => {
    const el = parseMath(`<math><msqrt><mi>x</mi></msqrt></math>`);
    expect(mathmlElementToLatex(el)).toBe("\\sqrt{x}");
  });

  it("converts munderover sum to \\sum_{from}^{to}", () => {
    const el = parseMath(`
      <math><munderover>
        <mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi>
      </munderover></math>
    `);
    const result = mathmlElementToLatex(el);
    expect(result).toContain("\\sum");
  });

  it("convertLatexDelimiters converts $$...$$ to data-math-block", () => {
    const doc = new DOMParser().parseFromString(
      "<p>Texto $$\\frac{a}{b}$$ más texto</p>",
      "text/html"
    );
    convertLatexDelimiters(doc.body);
    expect(doc.body.innerHTML).toContain("data-math-block");
    expect(doc.body.innerHTML).toContain("frac");
  });

  it("convertLatexDelimiters converts \\[...\\] to data-math-block", () => {
    const doc = new DOMParser().parseFromString(
      "<p>Texto \\[E = mc^2\\] fin</p>",
      "text/html"
    );
    convertLatexDelimiters(doc.body);
    expect(doc.body.innerHTML).toContain("data-math-block");
  });

  it("convertLatexDelimiters converts \\(...\\) to data-math-inline", () => {
    const doc = new DOMParser().parseFromString(
      "<p>p \\(p < 0.05\\) valor</p>",
      "text/html"
    );
    convertLatexDelimiters(doc.body);
    expect(doc.body.innerHTML).toContain("data-math-inline");
  });

  it("convertLatexDelimiters does not modify text without delimiters", () => {
    const original = "<p>Texto normal sin fórmulas $100 precio</p>";
    const doc = new DOMParser().parseFromString(original, "text/html");
    convertLatexDelimiters(doc.body);
    expect(doc.body.innerHTML).not.toContain("data-math");
  });
});
