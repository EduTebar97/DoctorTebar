import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/auth.schema.js";
import { env } from "../config/env.js";

describe("Auth schema", () => {
  it("rejects malformed login", () => {
    const result = loginSchema.safeParse({ body: { email: "wrong", password: "short" } });
    expect(result.success).toBe(false);
  });

  it("creates jwt tokens compatible with bearer authentication", () => {
    const token = jwt.sign({ userId: "507f1f77bcf86cd799439011" }, env.jwtSecret, { expiresIn: "1h" });
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    expect(payload.userId).toBe("507f1f77bcf86cd799439011");
  });
});
