import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "dr.tebar@gmail.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe("admin operational modules", () => {
  test.skip(({ isMobile }) => isMobile, "Operational admin modules are covered once in desktop Chromium.");

  test("admin can open editorial, calendar, media, users and audit modules", async ({ page }) => {
    await login(page);
    const pages = [
      ["/admin/editorial", /centro editorial/i],
      ["/admin/calendar", /calendario editorial/i],
      ["/admin/media", /biblioteca de medios/i],
      ["/admin/users", /usuarios y roles/i],
      ["/admin/audit", /auditoria/i]
    ] as const;

    for (const [path, heading] of pages) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("post editor exposes an editable rich text content block", async ({ page }) => {
    await login(page);
    await page.goto("/admin/posts/new");
    await expect(page.getByText(/estado del post/i)).toBeVisible();
    const editor = page.locator(".ProseMirror");
    await expect(editor).toBeVisible();
    await editor.fill("Contenido editable desde la zona privada del blog.");
    await expect(editor).toContainText("Contenido editable desde la zona privada del blog.");
  });
});
