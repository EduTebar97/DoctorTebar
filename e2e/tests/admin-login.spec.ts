import { expect, test } from "@playwright/test";

test("admin login page is available", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /acceso privado/i })).toBeVisible();
});
