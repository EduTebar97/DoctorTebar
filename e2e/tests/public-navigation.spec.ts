import { expect, test } from "@playwright/test";

test("public homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Eduardo Tebar Boti").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /blog/i }).first()).toBeVisible();
});
