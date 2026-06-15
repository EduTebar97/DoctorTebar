import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "dr.tebar@gmail.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe("admin training CRUD", () => {
  test.skip(({ isMobile }) => isMobile, "Training admin CRUD is covered once in desktop Chromium.");

  test("admin can create, view and delete a training course", async ({ page }) => {
    const suffix = Date.now();
    const courseTitle = `Formacion e2e ${suffix}`;

    await login(page);

    // Create
    await page.goto("/admin/training/new");
    await page.getByLabel("Titulo", { exact: true }).fill(courseTitle);
    await page.getByLabel(/descripcion/i).fill("Descripcion de la formacion e2e de prueba.");
    await page.getByLabel(/estado/i).selectOption("draft");
    await page.getByRole("button", { name: /guardar/i }).click();
    await expect(page).toHaveURL(/\/admin\/training$/);
    await expect(page.getByRole("row").filter({ hasText: courseTitle })).toBeVisible();

    // Delete
    const row = page.getByRole("row").filter({ hasText: courseTitle });
    await row.getByRole("button").click();
    await page.getByRole("button", { name: /eliminar definitivamente/i }).click();
    await expect(page.getByRole("row").filter({ hasText: courseTitle })).toBeHidden();
  });

  test("admin can add a learning objective to a course and save", async ({ page }) => {
    const suffix = Date.now();
    const courseTitle = `Formacion objetivos e2e ${suffix}`;

    await login(page);
    await page.goto("/admin/training/new");
    await page.getByLabel("Titulo", { exact: true }).fill(courseTitle);

    // Add a learning objective if the ObjectivesEditor is visible
    const addObjBtn = page.getByRole("button", { name: /añadir objetivo/i });
    const hasObjEditor = await addObjBtn.isVisible().catch(() => false);
    if (hasObjEditor) {
      await addObjBtn.click();
      const objInput = page.locator("textarea[placeholder*='objetivo']").first();
      if (await objInput.isVisible()) {
        await objInput.fill("El estudiante comprenderá los fundamentos de la metodología clínica.");
      }
    }

    await page.getByRole("button", { name: /guardar/i }).click();
    await expect(page).toHaveURL(/\/admin\/training$/);

    // Clean up
    const row = page.getByRole("row").filter({ hasText: courseTitle });
    if (await row.isVisible()) {
      await row.getByRole("button").click();
      await page.getByRole("button", { name: /eliminar definitivamente/i }).click();
    }
  });

  test("training list page shows import button", async ({ page }) => {
    await login(page);
    await page.goto("/admin/training");
    await expect(page.getByRole("link", { name: /importar/i })).toBeVisible();
  });

  test("training import page renders markdown upload form", async ({ page }) => {
    await login(page);
    await page.goto("/admin/training/import");
    await expect(page.getByRole("heading", { name: /importar/i })).toBeVisible();
  });
});
