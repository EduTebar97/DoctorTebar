import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "admin@example.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe("interactive guides", () => {
  test.skip(({ isMobile }) => isMobile, "Tours are covered once in desktop Chromium; mobile keeps admin login coverage.");

  test("admin can open guide center", async ({ page }) => {
    await login(page);
    await page.goto("/admin/guides");
    await expect(page.getByRole("heading", { name: /guia interactiva/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Crear y publicar un articulo de blog" })).toBeVisible();
    await expect(page.getByTestId("guide-card-create-blog-post")).toBeVisible();
  });

  test("admin can start blog creation guide", async ({ page }) => {
    await login(page);
    await page.goto("/admin/guides");
    await page.getByTestId("start-guide-create-blog-post").click();
    await expect(page).toHaveURL(/\/admin\/posts\/new/);
    await expect(page.getByText("Titulo del articulo")).toBeVisible();
  });
});
