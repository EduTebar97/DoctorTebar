import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "../../components/public/ContactForm";

vi.mock("../../services/contentService", () => ({
  createInquiry: vi.fn().mockResolvedValue({ _id: "mock-id" })
}));

describe("ContactForm", () => {
  it("renders all required form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fase del proyecto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de objetivo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar consulta/i })).toBeInTheDocument();
  });

  it("shows a name validation error when submitted empty", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    await waitFor(() => {
      expect(screen.getByText(/indica tu nombre/i)).toBeInTheDocument();
    });
  });

  it("shows email and message errors when only name is filled", async () => {
    render(<ContactForm />);
    // Fill only the name — email remains empty, which fails z.string().email()
    await userEvent.type(screen.getByLabelText(/nombre/i), "Eduardo");
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    await waitFor(() => {
      expect(screen.getByText(/email no valido/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("shows a message validation error when message is too short", async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/nombre/i), "Eduardo Tebar");
    await userEvent.type(screen.getByLabelText(/email/i), "edu@example.com");
    await userEvent.type(screen.getByLabelText(/mensaje/i), "Corto");
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));
    await waitFor(() => {
      expect(screen.getByText(/describe brevemente el proyecto/i)).toBeInTheDocument();
    });
  });

  it("shows success message after successful submission", async () => {
    const { createInquiry } = await import("../../services/contentService");
    (createInquiry as ReturnType<typeof vi.fn>).mockResolvedValue({ _id: "mock-id" });

    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/nombre/i), "Eduardo Tebar");
    await userEvent.type(screen.getByLabelText(/email/i), "edu@example.com");
    await userEvent.type(screen.getByLabelText(/mensaje/i), "Este es un mensaje de consulta suficientemente largo para pasar validación.");
    fireEvent.click(screen.getByLabelText(/acepto/i));
    fireEvent.click(screen.getByRole("button", { name: /enviar consulta/i }));

    await waitFor(() => {
      expect(screen.getByText(/consulta registrada/i)).toBeInTheDocument();
    });
  });

  it("projectStage select has all required options", () => {
    render(<ContactForm />);
    const select = screen.getByLabelText(/fase del proyecto/i) as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("idea");
    expect(options).toContain("protocolo");
    expect(options).toContain("analisis");
    expect(options).toContain("manuscrito");
    expect(options).toContain("revision");
  });

  it("objectiveType select has all required options", () => {
    render(<ContactForm />);
    const select = screen.getByLabelText(/tipo de objetivo/i) as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("causal");
    expect(options).toContain("predictivo");
    expect(options).toContain("descriptivo");
    expect(options).toContain("diagnostico");
    expect(options).toContain("pronostico");
    expect(options).toContain("mixto");
    expect(options).toContain("no_claro");
  });
});
