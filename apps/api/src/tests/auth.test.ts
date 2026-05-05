import { describe, expect, it } from "vitest";
import { loginSchema } from "../schemas/auth.schema.js";

describe("Auth schema", () => {
  it("rejects malformed login", () => {
    const result = loginSchema.safeParse({ body: { email: "wrong", password: "short" } });
    expect(result.success).toBe(false);
  });
});
