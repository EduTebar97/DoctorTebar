import { expect, test } from "@playwright/test";

test("visitor can submit an inquiry", async ({ page }) => {
  await page.goto("/contacto");
  await page.fill('input[name="name"]', "Investigadora Clinica");
  await page.fill('input[name="email"]', "investigadora@example.com");
  await page.fill('input[name="organization"]', "Hospital Demo");
  await page.selectOption('select[name="projectStage"]', "protocolo");
  await page.selectOption('select[name="objectiveType"]', "causal");
  await page.fill('textarea[name="message"]', "Necesito revisar el estimando causal, los criterios de inclusion y el plan de analisis del estudio.");
  await page.check('input[name="consent"]');
  await page.getByRole("button", { name: /enviar consulta/i }).click();
  await expect(page.getByText(/consulta registrada/i)).toBeVisible();
});
