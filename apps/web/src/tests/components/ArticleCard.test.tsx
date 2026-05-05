import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ArticleCard } from "../../components/public/ArticleCard";

describe("ArticleCard", () => {
  it("renders article card", () => {
    render(
      <MemoryRouter>
        <ArticleCard post={{ title: "Que es un estimando causal", excerpt: "Antes del modelo hay que definir el efecto.", slug: "estimando-causal", category: "causalidad", tags: [] }} />
      </MemoryRouter>
    );
    expect(screen.getByText("Que es un estimando causal")).toBeInTheDocument();
  });
});
