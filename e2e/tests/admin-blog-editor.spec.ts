import { expect, type Page, test } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.fill('input[name="email"]', "dr.tebar@gmail.com");
  await page.fill('input[name="password"]', "AdminPassword123!");
  await page.getByRole("button", { name: /entrar/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

async function pasteHtmlIntoEditor(page: Page, html: string) {
  await page.locator(".ProseMirror").click();
  await page.evaluate((payload) => {
    const editor = document.querySelector(".ProseMirror");
    if (!editor) throw new Error("Editor not found");
    const data = new DataTransfer();
    data.setData("text/html", payload);
    data.setData("text/plain", payload.replace(/<[^>]+>/g, ""));
    editor.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: data }));
  }, html);
}

async function deleteRow(page: Page, title: string) {
  const row = page.getByRole("row").filter({ hasText: title });
  await expect(row).toBeVisible();
  await row.getByRole("button").click();
  await page.getByRole("button", { name: /eliminar definitivamente/i }).click();
  await expect(row).toBeHidden();
}

test.describe("admin blog rich editor", () => {
  test.skip(({ isMobile }) => isMobile, "Rich editor paste/edit flow is covered once in desktop Chromium.");

  test("keeps pasted blog content visible and editable after clicking it", async ({ page }) => {
    const suffix = Date.now();
    const title = `Post editor paste e2e ${suffix}`;
    const pasted = "Contenido pegado para validar el editor privado";
    const appended = " y modificado despues de hacer click";

    await login(page);
    await page.goto("/admin/posts/new");
    await page.getByLabel("Titulo", { exact: true }).fill(title);
    await page.getByLabel(/extracto/i).fill("Extracto suficientemente largo para validar el editor privado.");
    await page.locator('select[name="category"]').selectOption("general");

    const editor = page.locator(".ProseMirror");
    await pasteHtmlIntoEditor(page, `<p>${pasted}</p>`);
    await expect(editor).toContainText(pasted);

    await editor.click();
    await page.keyboard.press(process.platform === "darwin" ? "Meta+End" : "Control+End");
    await page.keyboard.type(appended);
    await expect(editor).toContainText(pasted);
    await expect(editor).toContainText(appended.trim());

    await page.locator('input[name="tags"]').fill("e2e, editor");
    await page.getByRole("button", { name: /guardar borrador/i }).click();
    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.getByRole("row").filter({ hasText: title })).toBeVisible();

    await deleteRow(page, title);
  });
});
