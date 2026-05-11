import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "admin@example.com");
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

  test("post editor exposes scientific template and quality checklist", async ({ page }) => {
    await login(page);
    await page.goto("/admin/posts/new");
    await expect(page.getByText(/calidad editorial/i)).toBeVisible();
    await page.getByLabel(/plantilla cientifica/i).selectOption("critica");
    await expect(page.getByTestId("rich-editor")).toHaveValue(/Frase habitual/);
    await expect(page.getByText(/control metodologico/i)).toBeVisible();
  });
});
