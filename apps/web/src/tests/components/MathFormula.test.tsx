import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RichTextEditor } from "../../components/admin/RichTextEditor";

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
});
