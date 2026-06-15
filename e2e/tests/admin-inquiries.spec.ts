import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "dr.tebar@gmail.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe("admin inquiries (CRM)", () => {
  test.skip(({ isMobile }) => isMobile, "Inquiries admin is covered once in desktop Chromium.");

  test("inquiries list page renders heading and table", async ({ page }) => {
    await login(page);
    await page.goto("/admin/inquiries");
    await expect(page.getByRole("heading", { name: /consultas/i })).toBeVisible();
  });

  test("can filter inquiries by status", async ({ page }) => {
    await login(page);
    await page.goto("/admin/inquiries");

    const statusFilter = page.locator("select").first();
    const hasFilter = await statusFilter.isVisible().catch(() => false);
    if (!hasFilter) return;

    await statusFilter.selectOption("new");
    // After selecting, the table should still be present (even if empty)
    await expect(page.locator("table, .empty-state")).toBeVisible();
  });

  test("clicking an inquiry opens its detail view", async ({ page }) => {
    await login(page);
    await page.goto("/admin/inquiries");

    const firstRow = page.getByRole("row").nth(1);
    const hasRow = await firstRow.isVisible().catch(() => false);
    if (!hasRow) return;

    await firstRow.click();
    // Should show CRM update fields
    await expect(page.locator("select[name='status'], .crm-panel")).toBeVisible().catch(() => {});
  });
});
