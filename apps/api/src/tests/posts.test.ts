import { describe, expect, it } from "vitest";
import { postSchema } from "../schemas/content.schema.js";
import { slugify } from "../utils/slugify.js";

describe("Posts", () => {
  it("validates minimum post payload", () => {
    const result = postSchema.safeParse({
      body: {
        title: "Articulo de prueba",
        content: "Texto minimo del blog."
      }
    });
    expect(result.success).toBe(true);
  });

  it("creates stable slugs", () => {
    expect(slugify("Que es un estimando causal")).toBe("que-es-un-estimando-causal");
  });
});
