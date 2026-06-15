import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorMessage } from "../../components/common/ErrorMessage";

describe("Badge", () => {
  it("renders children inside a span", () => {
    render(<Badge>Causalidad</Badge>);
    expect(screen.getByText("Causalidad")).toBeInTheDocument();
  });

  it("applies the badge class", () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.querySelector(".badge")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No hay artículos" />);
    expect(screen.getByRole("heading", { name: /no hay artículos/i })).toBeInTheDocument();
  });

  it("renders optional text when provided", () => {
    render(<EmptyState title="Sin resultados" text="Prueba con otros filtros" />);
    expect(screen.getByText("Prueba con otros filtros")).toBeInTheDocument();
  });

  it("does not render a paragraph when text is omitted", () => {
    const { container } = render(<EmptyState title="Sin resultados" />);
    expect(container.querySelector("p")).toBeNull();
  });
});

describe("ErrorMessage", () => {
  it("renders the error message when provided", () => {
    render(<ErrorMessage message="Este campo es obligatorio" />);
    expect(screen.getByText("Este campo es obligatorio")).toBeInTheDocument();
  });

  it("renders nothing when message is undefined", () => {
    const { container } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when message is empty string", () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });
});
