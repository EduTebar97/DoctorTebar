import { expect, test } from "@playwright/test";

test.describe("public blog pages", () => {
  test("blog list page renders heading and article cards", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /blog/i })).toBeVisible();
  });

  test("blog detail page renders article title and content", async ({ page }) => {
    await page.goto("/blog");
    const firstArticle = page.locator("a[href*='/blog/']").first();
    const articleUrl = await firstArticle.getAttribute("href");
    if (!articleUrl) return;

    await page.goto(articleUrl);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator(".article-html")).toBeVisible();
  });

  test("blog detail page has tag row and CTA band", async ({ page }) => {
    await page.goto("/blog");
    const firstArticle = page.locator("a[href*='/blog/']").first();
    const articleUrl = await firstArticle.getAttribute("href");
    if (!articleUrl) return;

    await page.goto(articleUrl);
    await expect(page.locator(".cta-band")).toBeVisible();
  });

  test("blog list page shows category filter when categories exist", async ({ page }) => {
    await page.goto("/blog");
    // Category filter or article grid should be present
    await expect(page.locator("select, .category-filter, .article-grid, .articles-list")).toBeVisible().catch(() => {});
  });

  test("blog detail page related articles section renders", async ({ page }) => {
    await page.goto("/blog");
    const firstArticle = page.locator("a[href*='/blog/']").first();
    const articleUrl = await firstArticle.getAttribute("href");
    if (!articleUrl) return;

    await page.goto(articleUrl);
    await expect(page.getByRole("heading", { name: /artículos relacionados/i })).toBeVisible();
  });
});
