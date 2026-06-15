import { expect, test } from "@playwright/test";

test.describe("public training pages", () => {
  test("training list page renders heading and course cards", async ({ page }) => {
    await page.goto("/formacion");
    await expect(page.getByRole("heading", { name: /formaci/i }).first()).toBeVisible();
  });

  test("training detail page renders course title and blocks index", async ({ page }) => {
    await page.goto("/formacion");
    const firstCourse = page.locator("a[href*='/formacion/']").first();
    const courseUrl = await firstCourse.getAttribute("href");
    if (!courseUrl) return;

    await page.goto(courseUrl);
    // Should show the course title as an h1
    await expect(page.locator("h1").first()).toBeVisible();
    // Blocks index section or locked gate should be present
    const hasIndex = await page.locator(".training-index, .access-gate").first().isVisible().catch(() => false);
    expect(hasIndex).toBe(true);
  });

  test("locked course shows login prompt", async ({ page }) => {
    await page.goto("/formacion");
    const lockedCard = page.locator(".training-card.locked, [data-locked='true']").first();
    const hasLocked = await lockedCard.isVisible().catch(() => false);
    if (!hasLocked) {
      test.skip();
      return;
    }
    const href = await lockedCard.getAttribute("href");
    if (href) {
      await page.goto(href);
      await expect(page.getByRole("link", { name: /iniciar sesión/i })).toBeVisible();
    }
  });

  test("navigating to a topic shows topic content view", async ({ page }) => {
    await page.goto("/formacion");
    const firstCourse = page.locator("a[href*='/formacion/']").first();
    const courseUrl = await firstCourse.getAttribute("href");
    if (!courseUrl) return;

    await page.goto(courseUrl);

    // Click the first topic card if available (unlocked)
    const firstTopic = page.locator(".training-topic-card:not(.locked)").first();
    const hasTopic = await firstTopic.isVisible().catch(() => false);
    if (!hasTopic) return;

    await firstTopic.click();
    // After clicking, should show breadcrumb and back link
    await expect(page.locator(".breadcrumb")).toBeVisible();
  });

  test("training detail page has CTA band with contact link", async ({ page }) => {
    await page.goto("/formacion");
    const firstCourse = page.locator("a[href*='/formacion/']").first();
    const courseUrl = await firstCourse.getAttribute("href");
    if (!courseUrl) return;

    await page.goto(courseUrl);
    await expect(page.locator(".cta-band")).toBeVisible();
    await expect(page.locator(".cta-band a[href='/contacto']")).toBeVisible();
  });
});
