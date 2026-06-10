import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RichTextEditor } from "../../components/admin/RichTextEditor";

function pasteHtml(element: HTMLElement, html: string) {
  fireEvent.paste(element, {
    clipboardData: {
      getData: (type: string) => (type === "text/html" ? html : "")
    }
  });
}

describe("RichTextEditor", () => {
  it("keeps pasted content editable after clicking inside the editor", async () => {
    const handleChange = vi.fn();
    render(<RichTextEditor value="" onChange={handleChange} />);

    const editor = screen.getByRole("textbox");
    pasteHtml(editor, "<p>Contenido pegado desde el portapapeles</p>");

    await waitFor(() => {
      expect(editor).toHaveTextContent("Contenido pegado desde el portapapeles");
    });

    await userEvent.click(editor);
    await userEvent.keyboard(" y editado");

    await waitFor(() => {
      expect(editor).toHaveTextContent("Contenido pegado desde el portapapeles");
      expect(editor).toHaveTextContent("y editado");
    });
    expect(handleChange).toHaveBeenLastCalledWith(expect.stringContaining("editado"));
  });
});
