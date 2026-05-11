import { expect, test } from "@playwright/test";

test.describe("public pages", () => {
  test("all public top-level pages render their main heading", async ({ page }) => {
    const pages = [
      { path: "/", text: /metodologia clinica/i },
      { path: "/sobre-mi", heading: /sobre eduardo/i },
      { path: "/servicios", heading: /servicios/i },
      { path: "/blog", heading: /blog/i },
      { path: "/noticias", heading: /noticias/i },
      { path: "/recursos", heading: /recursos/i },
      { path: "/contacto", heading: /contacto/i }
    ];

    for (const item of pages) {
      await page.goto(item.path);
      if (item.heading) {
        await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
      } else {
        await expect(page.getByText(item.text!).first()).toBeVisible();
      }
    }
  });
});
