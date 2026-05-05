import { expect, test } from "@playwright/test";

test("public blog renders seeded API content", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByText("Que es un estimando causal y por que importa")).toBeVisible();
  await page.getByRole("link", { name: "Que es un estimando causal y por que importa" }).click();
  await expect(page.getByRole("heading", { name: "Que es un estimando causal y por que importa" })).toBeVisible();
});
