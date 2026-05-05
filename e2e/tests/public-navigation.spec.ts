import { expect, test } from "@playwright/test";

test("public homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Eduardo Tebarbotic").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /blog/i }).first()).toBeVisible();
});
