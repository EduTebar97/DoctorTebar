import { describe, expect, it } from "vitest";
import { inquirySchema } from "../schemas/content.schema.js";

describe("Inquiries", () => {
  it("validates public inquiry payload", () => {
    const result = inquirySchema.safeParse({ body: { name: "A" } });
    expect(result.success).toBe(false);
  });
});
