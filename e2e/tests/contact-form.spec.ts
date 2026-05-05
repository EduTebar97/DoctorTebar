import { expect, test } from "@playwright/test";

test("contact form validates required fields", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByRole("button", { name: /enviar consulta/i }).click();
  await expect(page.getByText(/indica tu nombre/i)).toBeVisible();
});
