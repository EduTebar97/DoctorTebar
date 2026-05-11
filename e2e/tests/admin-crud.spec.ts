import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "admin@example.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

async function deleteRow(page: Page, title: string) {
  const row = page.getByRole("row").filter({ hasText: title });
  await expect(row).toBeVisible();
  await row.getByRole("button").click();
  await expect(row).toBeHidden();
}

test.describe("admin CRUD", () => {
  test.skip(({ isMobile }) => isMobile, "Admin CRUD mutations are covered once in desktop Chromium.");

  test("admin can manage posts, news, resources and services", async ({ page }) => {
    const suffix = Date.now();
    const postTitle = `Post e2e ${suffix}`;
    const newsTitle = `Noticia e2e ${suffix}`;
    const resourceTitle = `Recurso e2e ${suffix}`;
    const serviceTitle = `Servicio e2e ${suffix}`;

    await login(page);

    await page.goto("/admin/posts/new");
    await page.getByLabel("Titulo", { exact: true }).fill(postTitle);
    await page.getByLabel("Extracto", { exact: true }).fill("Extracto suficientemente largo para validar el formulario e2e.");
    await page.getByTestId("rich-editor").fill("<p>Contenido suficientemente largo para validar el flujo completo e2e.</p>");
    await page.locator('select[name="category"]').selectOption("general");
    await page.locator('input[name="tags"]').fill("e2e, test");
    await page.getByRole("button", { name: /publicar/i }).click();
    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.getByRole("row").filter({ hasText: postTitle })).toBeVisible();

    await page.goto("/blog");
    await expect(page.getByText(postTitle)).toBeVisible();
    await page.goto("/admin/posts");
    await deleteRow(page, postTitle);

    await page.goto("/admin/news/new");
    await page.getByLabel("Titulo", { exact: true }).fill(newsTitle);
    await page.getByLabel("Extracto", { exact: true }).fill("Extracto suficientemente largo para una noticia e2e.");
    await page.getByTestId("rich-editor").fill("<p>Contenido suficientemente largo para la noticia e2e.</p>");
    await page.getByRole("button", { name: /publicar/i }).click();
    await expect(page).toHaveURL(/\/admin\/news$/);
    await expect(page.getByRole("row").filter({ hasText: newsTitle })).toBeVisible();

    await page.goto("/noticias");
    await expect(page.getByText(newsTitle)).toBeVisible();
    await page.goto("/admin/news");
    await deleteRow(page, newsTitle);

    await page.goto("/admin/resources/new");
    await page.getByLabel("Titulo", { exact: true }).fill(resourceTitle);
    await page.getByLabel("Tipo").selectOption("guia");
    await page.getByLabel("Descripcion").fill("Descripcion suficientemente larga para validar el recurso e2e.");
    await page.getByLabel("URL externa").fill("https://example.com/recurso-e2e");
    await page.getByLabel("Estado").selectOption("published");
    await page.getByRole("button", { name: /guardar recurso/i }).click();
    await expect(page).toHaveURL(/\/admin\/resources$/);
    await expect(page.getByRole("row").filter({ hasText: resourceTitle })).toBeVisible();

    await page.goto("/recursos");
    await expect(page.getByText(resourceTitle)).toBeVisible();
    await page.goto("/admin/resources");
    await deleteRow(page, resourceTitle);

    await page.goto("/admin/services/new");
    await page.getByLabel("Titulo", { exact: true }).fill(serviceTitle);
    await page.getByLabel("Orden").fill("99");
    await page.getByLabel("Descripcion breve").fill("Descripcion breve suficientemente larga para servicio e2e.");
    await page.getByLabel("Descripcion completa").fill("Descripcion completa suficientemente larga para validar servicio e2e.");
    await page.getByLabel("Audiencia objetivo").fill("Investigadores clinicos");
    await page.getByLabel("Entregables").fill("Informe metodologico\nPlan de analisis");
    await page.getByLabel("Estado").selectOption("published");
    await page.getByRole("button", { name: /guardar servicio/i }).click();
    await expect(page).toHaveURL(/\/admin\/services$/);
    await expect(page.getByRole("row").filter({ hasText: serviceTitle })).toBeVisible();

    await page.goto("/servicios");
    await expect(page.getByText(serviceTitle)).toBeVisible();
    await page.goto("/admin/services");
    await deleteRow(page, serviceTitle);
  });
});
